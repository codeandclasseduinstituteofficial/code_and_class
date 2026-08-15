import express from 'express';
import {
  createLecture,
  getLectures,
  updateLecture,
  deleteLecture,
  getClassData,
  checkChapterAccess,
} from '../controllers/lecture.controller.js';
import { admin, optionalAuth, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/chapter-access/:chapterId', protect, checkChapterAccess);

router.get('/class/:classId', optionalAuth, getClassData);

router.post('/', protect, admin, createLecture);

router.get('/', optionalAuth, getLectures);

router.route('/:id')
  .put(protect, admin, updateLecture)
  .delete(protect, admin, deleteLecture);

export default router;
