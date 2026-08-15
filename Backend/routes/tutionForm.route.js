import express from "express";
import {
    registerStudent,
    editStudent,
    deleteStudent,
    getAllStudents,
} from "../controllers/tutionForm.controller.js";
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all students
router.get("/", protect, admin, getAllStudents);

// Register student
router.post("/", registerStudent);

// Edit student
router.put("/:id", protect, admin, editStudent);

// Delete student
router.delete("/:id", protect, admin, deleteStudent);

export default router;
