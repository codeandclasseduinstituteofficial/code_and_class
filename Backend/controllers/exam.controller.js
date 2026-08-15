import asyncHandler from "express-async-handler";
import Exam from "../models/exam.model.js";

// @desc  Admin: post a new exam notice
// @route POST /api/exams
// @access Private/Admin
export const createExam = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error("title and description are required");
    }

    const exam = await Exam.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: exam });
});

// @desc  Get every exam notice, most recent first
// @route GET /api/exams
// @access Public
export const getAllExams = asyncHandler(async (req, res) => {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json({ success: true, data: exams });
});

// @desc  Get a single exam notice
// @route GET /api/exams/:id
// @access Public
export const getExamById = asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
    }

    res.json({ success: true, data: exam });
});

// @desc  Admin: edit an exam notice
// @route PUT /api/exams/:id
// @access Private/Admin
export const updateExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
    }

    res.json({ success: true, data: exam });
});

// @desc  Admin: delete an exam notice
// @route DELETE /api/exams/:id
// @access Private/Admin
export const deleteExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
    }

    res.json({ success: true, message: "Exam deleted" });
});
