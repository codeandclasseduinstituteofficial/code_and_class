import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Cart from '../models/cart.model.js';
import StationeryProduct from '../models/stationeryProduct.model.js';
import StationeryOrder from '../models/stationeryOrder.model.js';
import { clearCartForUser } from './cart.controller.js';

// Built lazily, same reasoning as payment.controller.js: this must not run
// before dotenv has loaded the Razorpay keys.
let razorpayInstance = null;
const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error(
            'Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env and restart the server.'
        );
    }
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

// Loads the user's cart, checks every line is still available, and returns
// an order-ready item snapshot plus the total in paise. Throws (via res)
// on an empty cart or an item that's gone out of stock since it was added.
const buildOrderFromCart = async (userId, res) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Your cart is empty');
    }

    const items = [];
    let amountRupees = 0;

    for (const line of cart.items) {
        const product = line.product;

        if (!product) continue; // product was deleted — skip it silently

        if (!product.inStock || (product.stockQuantity ?? 0) < line.quantity) {
            res.status(400);
            throw new Error(`"${product.name}" doesn't have enough stock right now`);
        }

        items.push({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: line.quantity,
        });

        amountRupees += product.price * line.quantity;
    }

    if (items.length === 0) {
        res.status(400);
        throw new Error('Your cart is empty');
    }

    return { items, amountInPaise: Math.round(amountRupees * 100) };
};

const validateShipping = (body, res) => {
    const { name, phone, address } = body;
    if (!name || !phone || !address) {
        res.status(400);
        throw new Error('Name, phone number and delivery address are required');
    }
    return { name, phone, address };
};

// Reduce stock for whatever was actually ordered.
const decrementStock = async (items) => {
    for (const item of items) {
        const product = await StationeryProduct.findById(item.product);
        if (!product) continue;
        product.stockQuantity = Math.max(0, (product.stockQuantity || 0) - item.quantity);
        if (product.stockQuantity === 0) product.inStock = false;
        await product.save();
    }
};

// @desc  Place a Pay-on-Delivery order from the current cart
// @route POST /api/stationery-orders/offline
// @access Private
export const createOfflineOrder = asyncHandler(async (req, res) => {
    const shipping = validateShipping(req.body, res);
    const { items, amountInPaise } = await buildOrderFromCart(req.user.id, res);

    const order = await StationeryOrder.create({
        user: req.user.id,
        items,
        amount: amountInPaise,
        shipping,
        paymentMode: 'offline',
        paymentStatus: 'pending', // collected on delivery
        deliveryStatus: 'placed',
    });

    await decrementStock(items);
    await clearCartForUser(req.user.id);

    res.status(201).json({
        success: true,
        message: 'Order placed successfully. Pay when it arrives.',
        order,
    });
});

// @desc  Create a Razorpay order for the current cart
// @route POST /api/stationery-orders/create-online-order
// @access Private
export const createOnlineOrder = asyncHandler(async (req, res) => {
    const shipping = validateShipping(req.body, res);
    const { items, amountInPaise } = await buildOrderFromCart(req.user.id, res);

    if (amountInPaise <= 0) {
        res.status(400);
        throw new Error('Invalid order amount');
    }

    let razorpayOrder;
    try {
        razorpayOrder = await getRazorpay().orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `stn_${req.user.id.toString().slice(-10)}_${Date.now()}`,
        });
    } catch (err) {
        const description = err?.error?.description || err?.message || 'Failed to create the payment order';
        res.status(err?.statusCode || 500);
        throw new Error(description);
    }

    const order = await StationeryOrder.create({
        user: req.user.id,
        items,
        amount: amountInPaise,
        shipping,
        paymentMode: 'online',
        paymentStatus: 'pending',
        deliveryStatus: 'placed',
        razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        dbOrderId: order._id,
    });
});

// @desc  Verify a Razorpay payment for a stationery order
// @route POST /api/stationery-orders/verify
// @access Private
export const verifyStationeryPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400);
        throw new Error('Missing payment verification fields');
    }

    const order = await StationeryOrder.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized for this order');
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        order.paymentStatus = 'failed';
        await order.save();
        res.status(400);
        throw new Error('Payment verification failed');
    }

    if (order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        await decrementStock(order.items);
        await clearCartForUser(req.user.id);
    }

    res.json({ success: true, message: 'Payment verified! Your order has been placed.', order });
});

// @desc  Get the logged-in user's stationery orders
// @route GET /api/stationery-orders/my
// @access Private
export const getMyStationeryOrders = asyncHandler(async (req, res) => {
    const orders = await StationeryOrder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc  Admin: view all placed stationery orders (successful/offline only —
//        abandoned online payment attempts that never completed are hidden)
// @route GET /api/stationery-orders/admin/all
// @access Private/Admin
export const getAllStationeryOrders = asyncHandler(async (req, res) => {
    const orders = await StationeryOrder.find({
        $or: [{ paymentMode: 'offline' }, { paymentStatus: 'paid' }],
    })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.json(orders);
});

// @desc  Admin: move an order forward — placed -> out_for_delivery -> delivered
// @route PATCH /api/stationery-orders/admin/:id/status
// @access Private/Admin
export const adminUpdateDeliveryStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!['out_for_delivery', 'delivered'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const order = await StationeryOrder.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const validTransitions = {
        out_for_delivery: 'placed',
        delivered: 'out_for_delivery',
    };

    if (order.deliveryStatus !== validTransitions[status]) {
        res.status(400);
        throw new Error(
            `Order must be "${validTransitions[status].replace('_', ' ')}" before it can be marked "${status.replace('_', ' ')}"`
        );
    }

    order.deliveryStatus = status;
    if (status === 'out_for_delivery') order.outForDeliveryAt = new Date();
    if (status === 'delivered') {
        order.deliveredAt = new Date();
        // Delivered COD orders are considered paid on collection.
        if (order.paymentMode === 'offline') order.paymentStatus = 'paid';
    }

    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
});
