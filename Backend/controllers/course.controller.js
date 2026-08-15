import Course from '../models/course.model.js';
import asyncHandler from 'express-async-handler';

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

export const getCourses = asyncHandler(async (req, res) => {
  const list = await Course.find();
  res.json(list);
});


export const getCourseById = asyncHandler(async (req, res) => {
  const list = await Course.findById(req.params.id);
  res.json(list);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: 'Course deleted' });
});

export const getPopularCourses = async (req, res) => {
  const courses = await Course.find({ isPopular: true })
    .select('title thumbnail duration price discount course')
    .limit(4)
    .sort({ createdAt: -1 });

  res.json(courses);
};

export const getOnlineCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    courseType: {
      $in: ["only-online", "online-offline"]
    }
  })
    .select('title thumbnail duration price discount course courseType')
    .sort({ createdAt: -1 });

  res.json(courses);
});

export const getOnlineCourseById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const course = await Course.findOne({
      _id: id,
      courseType: {
          $in: ["only-online", "online-offline"]
      }
  })
  .select(
      'title thumbnail duration price discount description course courseType jobs isPopular'
  );


  if (!course) {
      return res.status(404).json({
          message: "Online course not found"
      });
  }


  res.status(200).json(course);

});