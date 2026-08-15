import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';
import { admin, optionalAuth, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createNote);

router.get('/', optionalAuth, getNotes);

router.route('/:id')
  .put(protect, admin, updateNote)
  .delete(protect, admin, deleteNote);

export default router;