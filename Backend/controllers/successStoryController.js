// controllers/successStoryController.js

import SuccessStory from "../models/SuccessStory.js";

export const createSuccessStory = async (req, res) => {
    try {
        const story = await SuccessStory.create(req.body);

        res.status(201).json({
            success: true,
            story,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getSuccessStories = async (req, res) => {
    try {
        const stories = await SuccessStory.find().sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            stories,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteSuccessStory = async (req, res) => {
    try {
        await SuccessStory.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};