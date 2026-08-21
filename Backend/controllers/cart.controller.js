import asyncHandler from 'express-async-handler';
import Cart from '../models/cart.model.js';
import StationeryProduct from '../models/stationeryProduct.model.js';

// Fetch (or lazily create) the logged-in user's cart, populated with live
// product data, and drop any line items whose product no longer exists.
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
        return cart;
    }

    const validItems = cart.items.filter((item) => item.product);
    if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
    }

    return cart;
};

const shapeCart = (cart) => {
    const items = cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        lineTotal: (item.product?.price || 0) * item.quantity,
    }));

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items.reduce((sum, i) => sum + i.lineTotal, 0);

    return { _id: cart._id, items, totalItems, totalAmount };
};

// @desc  Get the logged-in user's cart — same cart on every device
// @route GET /api/cart
// @access Private
export const getCart = asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user.id);
    res.json(shapeCart(cart));
});

// @desc  Add a product to the cart (or increase its quantity)
// @route POST /api/cart/add
// @access Private
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    if (!productId) {
        res.status(400);
        throw new Error('productId is required');
    }

    const product = await StationeryProduct.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!product.inStock) {
        res.status(400);
        throw new Error('This product is currently out of stock');
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.status(201).json(shapeCart(populated));
});

// @desc  Set an exact quantity for a product in the cart (removes it if 0 or less)
// @route PUT /api/cart/update
// @access Private
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        res.status(400);
        throw new Error('productId is required');
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) {
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
        const existing = cart.items.find((i) => i.product.toString() === productId);
        if (existing) {
            existing.quantity = qty;
        } else {
            cart.items.push({ product: productId, quantity: qty });
        }
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(shapeCart(populated));
});

// @desc  Remove one product from the cart
// @route DELETE /api/cart/remove/:productId
// @access Private
export const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(shapeCart(populated));
});

// Used internally by the order controller after checkout succeeds.
export const clearCartForUser = async (userId) => {
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
};
