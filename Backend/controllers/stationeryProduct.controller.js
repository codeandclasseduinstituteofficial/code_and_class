import asyncHandler from 'express-async-handler';
import StationeryProduct from '../models/stationeryProduct.model.js';

// @desc  Get all stationery products (supports ?gift=true, ?sale=true, ?category=)
// @route GET /api/stationery-products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.gift === 'true') filter.isGift = true;
    if (req.query.sale === 'true') filter.onSale = true;
    if (req.query.inStock === 'true') filter.inStock = true;
    if (req.query.category) filter.category = req.query.category;

    const products = await StationeryProduct.find(filter).sort({ createdAt: -1 });
    res.json(products);
});

// @desc  Get a single stationery product
// @route GET /api/stationery-products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await StationeryProduct.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    res.json(product);
});

// @desc  Create a stationery product
// @route POST /api/stationery-products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        image,
        category,
        price,
        oldPrice,
        stockQuantity,
        inStock,
        isGift,
        onSale,
    } = req.body;

    if (!name || !image || price === undefined || price === null) {
        res.status(400);
        throw new Error('Name, image and price are required');
    }

    const rupees = Number(price);
    if (!Number.isFinite(rupees) || rupees < 0) {
        res.status(400);
        throw new Error('Please provide a valid price');
    }

    const product = await StationeryProduct.create({
        name,
        description: description || '',
        image,
        category: category || 'General',
        price: rupees,
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0,
        inStock: inStock !== undefined ? !!inStock : true,
        isGift: !!isGift,
        onSale: !!onSale,
    });

    res.status(201).json(product);
});

// @desc  Update a stationery product (including the gift / in-stock / sale toggles)
// @route PUT /api/stationery-products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await StationeryProduct.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const allowedFields = [
        'name',
        'description',
        'image',
        'category',
        'price',
        'oldPrice',
        'stockQuantity',
        'inStock',
        'isGift',
        'onSale',
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            product[field] = req.body[field];
        }
    });

    await product.save();

    res.json(product);
});

// @desc  Delete a stationery product
// @route DELETE /api/stationery-products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await StationeryProduct.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted' });
});
