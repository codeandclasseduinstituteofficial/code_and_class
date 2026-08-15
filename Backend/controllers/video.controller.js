import mongoose from "mongoose";
import ClassTen from "../models/classTenth.model.js";
import Intermediate from "../models/Intermediate.model.js";

export const getVideoDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Video ID is required",
            });
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        // =====================================================
        // CLASS 10
        // =====================================================
        const classTenQuery = isObjectId
            ? { $or: [{ "chapters.problems.videoId": id }, { "chapters.problems._id": id }] }
            : { "chapters.problems.videoId": id };

        const classTen = await ClassTen.findOne(classTenQuery).lean();

        if (classTen) {
            for (const chapter of classTen.chapters) {
                const problem = chapter.problems.find(
                    (p) => p.videoId === id || p._id.toString() === id
                );
                if (problem) {
                    return res.status(200).json({
                        success: true,
                        type: "Class10",
                        data: problem,
                    });
                }
            }
        }

        // =====================================================
        // INTERMEDIATE
        // =====================================================
        const intermediateQuery = isObjectId
            ? { $or: [{ "chapters.topics.videoId": id }, { "chapters.topics._id": id }] }
            : { "chapters.topics.videoId": id };

        const intermediate = await Intermediate.findOne(intermediateQuery).lean();

        if (intermediate) {
            for (const chapter of intermediate.chapters) {
                const topic = chapter.topics.find(
                    (t) => t.videoId === id || t._id.toString() === id
                );
                if (topic) {
                    return res.status(200).json({
                        success: true,
                        type: "Intermediate",
                        data: topic,
                    });
                }
            }
        }

        return res.status(404).json({
            success: false,
            message: "Video not found",
            videoId: id,
        });
    } catch (error) {
        console.error("Get video details error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};