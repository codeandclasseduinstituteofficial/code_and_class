import express from 'express';
import {
  createSpokenLecture,
  getSpokenLectures,
  updateSpokenLecture,
  deleteSpokenLecture,
  getSpokenLecturesByLevel
} from '../controllers/spokenLecture.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/class/:level', getSpokenLecturesByLevel)

router.post('/', protect, admin, createSpokenLecture);

router.get('/', getSpokenLectures);

router.route('/:id')
  .put(protect, admin, updateSpokenLecture)
  .delete(protect, admin, deleteSpokenLecture);

export default router;