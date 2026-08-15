import asyncHandler from 'express-async-handler';
import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';

// @desc  Get the logged-in user's enrolled courses
// @route GET /api/enrollments/my
// @access Private
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user.id }).populate(
    'course',
    'title thumbnail course duration'
  );
  res.json(enrollments);
});

// @desc  Check if the logged-in user has access to a specific course
// @route GET /api/enrollments/check/:courseId
// @access Private
export const checkEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    course: req.params.courseId,
  });
  res.json({ enrolled: !!enrollment });
});

// @desc  Admin: manually grant a user access to a course (e.g. offline payment, scholarship)
// @route POST /api/enrollments/grant
// @access Private/Admin
export const grantEnrollment = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ user: userId, course: courseId });
  if (existing) {
    res.status(400);
    throw new Error('User is already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    source: 'admin-granted',
  });

  res.status(201).json(enrollment);
});

// @desc  Admin: view every enrollment (for a course management view)
// @route GET /api/enrollments
// @access Private/Admin
export const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate('user', 'name email')
    .populate('course', 'title')
    .sort({ createdAt: -1 });
  res.json(enrollments);
});
