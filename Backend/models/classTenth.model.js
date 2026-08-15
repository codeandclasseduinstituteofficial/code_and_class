import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Public video identifier.
        // This is NOT the MongoDB _id.
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
            required: true,
        },

        chapterName: {
            type: String,
            required: true,
            trim: true,
        },

        problems: {
            type: [problemSchema],
            default: [],
        },
    },
    {
        _id: true,
    }
);

const classTenSchema = new mongoose.Schema(
    {
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
    "ClassTen",
    classTenSchema
);