import express from 'express';
import {
  getMyEnrollments,
  checkEnrollment,
  grantEnrollment,
  getAllEnrollments,
} from '../controllers/enrollment.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);
router.post('/grant', protect, admin, grantEnrollment);
router.get('/', protect, admin, getAllEnrollments);

export default router;
