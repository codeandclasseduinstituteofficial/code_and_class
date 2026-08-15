import express from 'express';
import {
    getGallery,
    createImage,
    updateImage,
    deleteImage,
} from '../controllers/gallery.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// /api/gallery
router.get('/', getGallery);
router.post('/', protect, admin, createImage);
router.put('/:id', protect, admin, updateImage);
router.delete('/:id', protect, admin, deleteImage);

export default router;
