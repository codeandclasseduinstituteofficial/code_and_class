import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
    {
        topicName: {
            type: String,
            required: true,
            trim: true,
        },

        // Public video identifier.
        videoId: {
            type: String,
            required: true,
            trim: true,
        },

        videoLink: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        price: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: true,
    }
);

const chapterSchema = new mongoose.Schema(
    {
        chapterNumber: {
            type: String,
            default: "",
        },

        chapterName: {
            type: String,
            required: true,
            trim: true,
        },

        topics: {
            type: [topicSchema],
            default: [],
        },
    },
    {
        _id: true,
    }
);

const intermediateSchema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
            trim: true,
        },

        group: {
            type: String,
            required: true,
            trim: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        subjectIcon: {
            type: String,
            default: "",
        },

        chapters: {
            type: [chapterSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Intermediate",
    intermediateSchema
);