import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StationeryProduct',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        // One cart per user — this is what lets a user log in on any device
        // and see the same cart.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
