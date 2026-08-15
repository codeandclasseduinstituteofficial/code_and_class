import express from "express";
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
} from "../controllers/exam.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getAllExams)
    .post(protect, admin, createExam);

router.route("/:id")
    .get(getExamById)
    .put(protect, admin, updateExam)
    .delete(protect, admin, deleteExam);

export default router;
