// controllers/studentVoiceController.js

import StudentVoice from "../models/StudentVoice.js";

export const createStudentVoice = async (req, res) => {
    try {
        const voice = await StudentVoice.create({
            ...req.body,
            studentId: req.user.id,
        });

        res.status(201).json({
            success: true,
            voice,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getStudentVoices = async (req, res) => {
    try {
        const voices = await StudentVoice.find({
            approved: true,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            voices,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteStudentVoice = async (req, res) => {
    try {
        await StudentVoice.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Student voice deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const approveStudentVoice = async (req, res) => {
    try {
        await StudentVoice.findByIdAndUpdate(req.params.id, {
            approved: true,
        });

        res.json({
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getAllStudentVoicesAdmin = async (req, res) => {
    try {
        const voices = await StudentVoice.find()
            .populate("studentId", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            voices,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getHomeSchoolingVoices = async (req, res) => {
    try {
        const voices = await StudentVoice.find({
            approved: true,
            course: {
                $regex: /^home[\s-]?schooling$/i
            }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            voices,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};