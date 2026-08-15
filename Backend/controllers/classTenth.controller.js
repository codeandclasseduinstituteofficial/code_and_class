import mongoose from "mongoose";
import ClassTen from "../models/classTenth.model.js";

// =====================================================
// CREATE SUBJECT
// =====================================================

export const createClassTen = async (req, res) => {
    try {
        const {
            subject,
            subjectIcon,
            chapters,
        } = req.body;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: "subject is required",
            });
        }

        const data = await ClassTen.create({
            subject,
            subjectIcon,
            chapters: chapters || [],
        });

        res.status(201).json({
            success: true,
            message: "Class 10 subject added",
            data,
        });
    } catch (error) {
        console.error(
            "Create Class 10 error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// GET ALL SUBJECTS
// =====================================================

export const getClassTen = async (req, res) => {
    try {
        const data = await ClassTen.find()
            .sort({
                createdAt: -1,
            })
            .lean();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Get Class 10 error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// GET ONE SUBJECT
// =====================================================

export const getClassTenById = async (req, res) => {
    try {
        const { id } = req.params;

        // IMPORTANT:
        // Prevent:
        // Cast to ObjectId failed for value "social-resources"
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Class 10 subject ID",
            });
        }

        const data =
            await ClassTen.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Class 10 subject not found",
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Get Class 10 by ID error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// UPDATE SUBJECT
// =====================================================

export const updateClassTen = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Class 10 subject ID",
            });
        }

        const data =
            await ClassTen.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Class 10 subject not found",
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Update Class 10 error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// DELETE SUBJECT
// =====================================================

export const deleteClassTen = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Class 10 subject ID",
            });
        }

        const data =
            await ClassTen.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Class 10 subject not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete Class 10 error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// ADD CHAPTER
// =====================================================

export const addChapter = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            chapterNumber,
            chapterName,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Class 10 subject ID",
            });
        }

        if (!chapterNumber || !chapterName) {
            return res.status(400).json({
                success: false,
                message:
                    "chapterNumber and chapterName are required",
            });
        }

        const data =
            await ClassTen.findByIdAndUpdate(
                id,
                {
                    $push: {
                        chapters: {
                            chapterNumber,
                            chapterName,
                            problems: [],
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        res.status(201).json({
            success: true,
            message: "Chapter added",
            data,
        });
    } catch (error) {
        console.error(
            "Add chapter error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// CREATE VIDEO ID
// =====================================================

const createVideoId = (text) => {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `${slug}-${Date.now()}-${Math.floor(
        Math.random() * 10000
    )}`;
};


// =====================================================
// ADD PROBLEM / VIDEO
// =====================================================

export const addProblem = async (req, res) => {
    try {
        const {
            id,
            chapterId,
        } = req.params;

        const {
            name,
            videoLink,
            description,
            isPaid,
            price,
        } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                chapterId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chapter ID",
            });
        }

        if (
            !name ||
            !videoLink ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "name, videoLink and description are required",
            });
        }

        const videoId =
            createVideoId(name);

        const data =
            await ClassTen.findOneAndUpdate(
                {
                    _id: id,
                    "chapters._id": chapterId,
                },
                {
                    $push: {
                        "chapters.$.problems": {
                            name,
                            videoId,
                            videoLink,
                            description,
                            isPaid: Boolean(isPaid),
                            price: isPaid
                                ? Number(price) || 0
                                : 0,
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!data) {
            return res.status(404).json({
                success: false,
                message:
                    "Subject or chapter not found",
            });
        }

        res.status(201).json({
            success: true,
            message: "Problem added",
            videoId,
            data,
        });
    } catch (error) {
        console.error(
            "Add problem error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// UPDATE PROBLEM
// =====================================================

export const updateProblem = async (
    req,
    res
) => {
    try {
        const {
            chapterId,
            problemId,
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                chapterId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chapter ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                problemId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        const updateData = {
            ...req.body,
        };

        // Do not allow videoId to disappear
        if (
            !updateData.videoId &&
            updateData.name
        ) {
            updateData.videoId =
                createVideoId(
                    updateData.name
                );
        }

        const updated =
            await ClassTen.findOneAndUpdate(
                {
                    "chapters._id": chapterId,
                    "chapters.problems._id":
                        problemId,
                },
                {
                    $set: {
                        "chapters.$[chapter].problems.$[problem]":
                            updateData,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            "chapter._id":
                                chapterId,
                        },
                        {
                            "problem._id":
                                problemId,
                        },
                    ],
                }
            );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message:
                    "Chapter or problem not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error(
            "Update problem error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// DELETE PROBLEM
// =====================================================

export const deleteProblem = async (
    req,
    res
) => {
    try {
        const {
            chapterId,
            problemId,
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                chapterId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chapter ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                problemId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid problem ID",
            });
        }

        const updated =
            await ClassTen.findOneAndUpdate(
                {
                    "chapters._id": chapterId,
                },
                {
                    $pull: {
                        "chapters.$.problems": {
                            _id: problemId,
                        },
                    },
                },
                {
                    new: true,
                }
            );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message:
                    "Chapter not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Problem deleted",
            data: updated,
        });
    } catch (error) {
        console.error(
            "Delete problem error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};