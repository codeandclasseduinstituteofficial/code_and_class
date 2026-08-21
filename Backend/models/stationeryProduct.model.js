import mongoose from 'mongoose';

const stationeryProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },

        description: {
            type: String,
            default: '',
            trim: true,
        },

        image: {
            type: String,
            required: [true, 'Product image is required'],
        },

        category: {
            type: String,
            default: 'General',
            trim: true,
        },

        // Current selling price, in rupees
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },

        // Optional strike-through price to show a discount badge
        oldPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        stockQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Admin-controlled toggles
        inStock: {
            type: Boolean,
            default: true,
        },

        isGift: {
            type: Boolean,
            default: false,
        },

        onSale: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const StationeryProduct = mongoose.model('StationeryProduct', stationeryProductSchema);

export default StationeryProduct;
