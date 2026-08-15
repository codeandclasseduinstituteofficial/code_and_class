import mongoose from "mongoose";
import Intermediate from "../models/Intermediate.model.js";


// =====================================================
// CREATE
// =====================================================

export const createIntermediate = async (
    req,
    res
) => {
    try {
        const {
            year,
            group,
            subject,
            subjectIcon,
            chapters,
        } = req.body;

        if (
            !year ||
            !group ||
            !subject
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "year, group and subject are required",
            });
        }

        const data =
            await Intermediate.create({
                year,
                group,
                subject,
                subjectIcon,
                chapters: chapters || [],
            });

        res.status(201).json({
            success: true,
            message: "Intermediate added",
            data,
        });
    } catch (error) {
        console.error(
            "Create Intermediate error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// GET ALL
// =====================================================

export const getIntermediate = async (
    req,
    res
) => {
    try {
        const data =
            await Intermediate.find()
                .sort({
                    year: 1,
                    group: 1,
                    subject: 1,
                })
                .lean();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Get Intermediate error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// GET ONE
// =====================================================

export const getIntermediateById = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Intermediate ID",
            });
        }

        const data =
            await Intermediate.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message:
                    "Intermediate subject not found",
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Get Intermediate by ID error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// UPDATE
// =====================================================

export const updateIntermediate = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Intermediate ID",
            });
        }

        const data =
            await Intermediate.findByIdAndUpdate(
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
                message:
                    "Intermediate subject not found",
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Update Intermediate error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// DELETE
// =====================================================

export const deleteIntermediate = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Intermediate ID",
            });
        }

        const data =
            await Intermediate.findByIdAndDelete(
                id
            );

        if (!data) {
            return res.status(404).json({
                success: false,
                message:
                    "Intermediate subject not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete Intermediate error:",
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

export const addChapter = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const {
            chapterNumber,
            chapterName,
        } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Intermediate ID",
            });
        }

        if (!chapterName) {
            return res.status(400).json({
                success: false,
                message:
                    "chapterName is required",
            });
        }

        const data =
            await Intermediate.findByIdAndUpdate(
                id,
                {
                    $push: {
                        chapters: {
                            chapterNumber,
                            chapterName,
                            topics: [],
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
            "Add Intermediate chapter error:",
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
// ADD TOPIC
// =====================================================

export const addTopic = async (
    req,
    res
) => {
    try {
        const {
            id,
            chapterId,
        } = req.params;

        const {
            topicName,
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
                message:
                    "Invalid Intermediate ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                chapterId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid chapter ID",
            });
        }

        if (
            !topicName ||
            !videoLink ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "topicName, videoLink and description are required",
            });
        }

        const videoId =
            createVideoId(topicName);

        const data =
            await Intermediate.findOneAndUpdate(
                {
                    _id: id,
                    "chapters._id": chapterId,
                },
                {
                    $push: {
                        "chapters.$.topics": {
                            topicName,
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
            message: "Topic added",
            videoId,
            data,
        });
    } catch (error) {
        console.error(
            "Add topic error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// UPDATE TOPIC
// =====================================================

export const updateTopic = async (
    req,
    res
) => {
    try {
        const {
            chapterId,
            topicId,
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                chapterId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid chapter ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                topicId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid topic ID",
            });
        }

        const updateData = {
            ...req.body,
        };

        if (
            !updateData.videoId &&
            updateData.topicName
        ) {
            updateData.videoId =
                createVideoId(
                    updateData.topicName
                );
        }

        const updated =
            await Intermediate.findOneAndUpdate(
                {
                    "chapters._id": chapterId,
                    "chapters.topics._id":
                        topicId,
                },
                {
                    $set: {
                        "chapters.$[chapter].topics.$[topic]":
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
                            "topic._id":
                                topicId,
                        },
                    ],
                }
            );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message:
                    "Chapter or topic not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error(
            "Update topic error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// DELETE TOPIC
// =====================================================

export const deleteTopic = async (
    req,
    res
) => {
    try {
        const {
            chapterId,
            topicId,
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                chapterId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid chapter ID",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                topicId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid topic ID",
            });
        }

        const updated =
            await Intermediate.findOneAndUpdate(
                {
                    "chapters._id": chapterId,
                },
                {
                    $pull: {
                        "chapters.$.topics": {
                            _id: topicId,
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
            message: "Topic deleted",
            data: updated,
        });
    } catch (error) {
        console.error(
            "Delete topic error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};