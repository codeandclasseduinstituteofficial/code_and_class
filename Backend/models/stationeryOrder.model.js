import mongoose from 'mongoose';

// Snapshot of a cart item at the time the order was placed, so later edits
// to the product (price change, deletion, etc.) never change a past order.
const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StationeryProduct',
        },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true }, // rupees, per unit, at time of order
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const stationeryOrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: (v) => Array.isArray(v) && v.length > 0,
        },

        // Total amount in paise (matches the convention used by the course/note
        // Razorpay orders elsewhere in the app)
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },

        // Delivery details supplied at checkout
        shipping: {
            name: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true },
            address: { type: String, required: true, trim: true },
        },

        paymentMode: {
            type: String,
            enum: ['online', 'offline'],
            required: true,
        },

        // Offline = pay on delivery, so it stays "pending" until the delivery
        // person collects payment; online is "pending" only for the brief
        // window between creating the Razorpay order and verifying payment.
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },

        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },

        // Order fulfilment status — admin moves this forward step by step.
        // There is deliberately no "cancelled" state: once placed, an order
        // stays in the pipeline through to delivery.
        deliveryStatus: {
            type: String,
            enum: ['placed', 'out_for_delivery', 'delivered'],
            default: 'placed',
        },

        outForDeliveryAt: { type: Date, default: null },
        deliveredAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const StationeryOrder = mongoose.model('StationeryOrder', stationeryOrderSchema);

export default StationeryOrder;
