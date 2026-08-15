import asyncHandler from "express-async-handler";
import SpokenEnglishLevel from "../models/spokenEnglishLevel.model.js";

// @desc  Admin: create a new level under a skill (e.g. Listening -> A1)
// @route POST /api/spoken-english
// @access Private/Admin
export const createLevel = asyncHandler(async (req, res) => {
    const {
        skill,
        levelName,
        title,
        description,
        audioUrl,
        videoUrl,
        imageUrl,
        writingPrompt,
        order,
    } = req.body;

    if (!skill || !levelName || !title) {
        res.status(400);
        throw new Error("skill, levelName and title are required");
    }

    const level = await SpokenEnglishLevel.create({
        skill,
        levelName,
        title,
        description,
        audioUrl,
        videoUrl,
        imageUrl,
        writingPrompt,
        order,
    });

    res.status(201).json({ success: true, data: level });
});

// @desc  Get every level, grouped implicitly by skill (used by admin dashboard)
// @route GET /api/spoken-english
// @access Public
export const getAllLevels = asyncHandler(async (req, res) => {
    const levels = await SpokenEnglishLevel.find().sort({
        skill: 1,
        order: 1,
        createdAt: 1,
    });

    res.json({ success: true, data: levels });
});

// @desc  Get all levels for one skill (Listening/Reading/Writing/Speaking)
// @route GET /api/spoken-english/skill/:skill
// @access Public
export const getLevelsBySkill = asyncHandler(async (req, res) => {
    const levels = await SpokenEnglishLevel.find({
        skill: req.params.skill,
    }).sort({ order: 1, createdAt: 1 });

    res.json({ success: true, data: levels });
});

// @desc  Get a single level's full content
// @route GET /api/spoken-english/:id
// @access Public
export const getLevelById = asyncHandler(async (req, res) => {
    const level = await SpokenEnglishLevel.findById(req.params.id);

    if (!level) {
        res.status(404);
        throw new Error("Level not found");
    }

    res.json({ success: true, data: level });
});

// @desc  Admin: update a level's content
// @route PUT /api/spoken-english/:id
// @access Private/Admin
export const updateLevel = asyncHandler(async (req, res) => {
    const level = await SpokenEnglishLevel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!level) {
        res.status(404);
        throw new Error("Level not found");
    }

    res.json({ success: true, data: level });
});

// @desc  Admin: delete a level
// @route DELETE /api/spoken-english/:id
// @access Private/Admin
export const deleteLevel = asyncHandler(async (req, res) => {
    const level = await SpokenEnglishLevel.findByIdAndDelete(req.params.id);

    if (!level) {
        res.status(404);
        throw new Error("Level not found");
    }

    res.json({ success: true, message: "Level deleted" });
});
