import express from "express";
import {
  addCourseApplication,
  updateCourseApplication,
  deleteCourseApplication,
  getAllCourseApplications,
} from "../controllers/courseApplication.controller.js";
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", protect, admin, getAllCourseApplications);

// Add new course application
router.post("/", addCourseApplication);

// Update course application by ID
router.put("/:id",  protect, admin, updateCourseApplication);

// Delete course application by ID
router.delete("/:id",  protect, admin, deleteCourseApplication);

export default router;
