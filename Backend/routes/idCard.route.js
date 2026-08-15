import express from 'express';
import { admin, protect } from '../middlewares/authMiddleware.js';
import { getUserIdCardData } from '../controllers/idCard.controller.js';

const router = express.Router();

// /api/gallery
router.get('/:id', getUserIdCardData);

export default router;
