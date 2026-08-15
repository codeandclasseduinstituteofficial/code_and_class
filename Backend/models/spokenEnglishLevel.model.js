import mongoose from "mongoose";

const spokenEnglishLevelSchema = new mongoose.Schema(
    {
        // Which of the 4 spoken-english skills this level belongs to
        skill: {
            type: String,
            enum: ["Listening", "Reading", "Writing", "Speaking"],
            required: true,
        },

        // Admin-entered level name, e.g. "A1", "A2", "B1" ... free text so
        // the admin isn't locked into a fixed CEFR list
        levelName: {
            type: String,
            required: true,
            trim: true,
        },

        // Short title shown on the level card, e.g. "A1 - Everyday Basics"
        title: {
            type: String,
            required: true,
        },

        // Main written information/content for this level (works for all
        // 4 skills as the primary lesson text)
        description: {
            type: String,
            default: "",
        },

        // Listening: audio link (YouTube or a direct audio URL)
        audioUrl: {
            type: String,
            default: "",
        },

        // Optional supporting video (YouTube link)
        videoUrl: {
            type: String,
            default: "",
        },

        // Reading: supporting image (Google Drive link, per site convention)
        imageUrl: {
            type: String,
            default: "",
        },

        // Writing: the writing task/prompt students respond to
        writingPrompt: {
            type: String,
            default: "",
        },

        // Controls display order among levels within the same skill
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "SpokenEnglishLevel",
    spokenEnglishLevelSchema
);
