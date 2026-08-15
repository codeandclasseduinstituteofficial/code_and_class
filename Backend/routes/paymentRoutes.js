import express from 'express';
import {
  createOrder,
  createNoteOrder,
  createChapterOrder,
  createTopicOrder,
  createApplicationOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
} from '../controllers/payment.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/create-note-order', protect, createNoteOrder);
router.post('/create-chapter-order', protect, createChapterOrder);
router.post('/create-topic-order', protect, createTopicOrder);
router.post('/create-application-order', protect, createApplicationOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);

export default router;
