import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cart.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Every cart route requires the user to be logged in — this is what makes
// "same cart on any device" and the "not logged in -> go to login" behaviour
// work automatically on the frontend.
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeCartItem);

export default router;
