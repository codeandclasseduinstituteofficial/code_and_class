import express from 'express';
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizForAdmin,
  getQuizzes,
  getQuizToAttempt,
  submitQuiz,
  getMyAttempts,
} from '../controllers/quiz.controller.js';
import { admin, optionalAuth, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Student history (declared before /:id so "attempts" isn't parsed as an id)
router.get('/attempts/my', protect, getMyAttempts);

router.get('/', optionalAuth, getQuizzes);
router.post('/', protect, admin, createQuiz);

router.get('/:id/admin', protect, admin, getQuizForAdmin);
router.put('/:id', protect, admin, updateQuiz);
router.delete('/:id', protect, admin, deleteQuiz);

router.get('/:id', optionalAuth, getQuizToAttempt);
router.post('/:id/submit', protect, submitQuiz);

export default router;
