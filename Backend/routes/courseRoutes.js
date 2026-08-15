import express from 'express';
import {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getCourseById,
    getPopularCourses,
    getOnlineCourses,
    getOnlineCourseById
} from '../controllers/course.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createCourse);

router.get('/', getCourses);
router.get('/popular', getPopularCourses);

router.get('/online-courses', getOnlineCourses);

router.get(
    "/online-courses/:id",
    getOnlineCourseById
);

router.route('/:id')
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

router.get('/:id', getCourseById)



export default router;