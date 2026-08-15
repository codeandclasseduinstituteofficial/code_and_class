import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        examDate: {
            type: Date,
        },

        applyLastDate: {
            type: Date,
        },

        // Google Drive link for a supporting image/notification PDF cover
        imageUrl: {
            type: String,
            default: "",
        },

        // YouTube link for a supporting explainer video
        videoUrl: {
            type: String,
            default: "",
        },

        // Where students go to apply / read the official notification
        applyLink: {
            type: String,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
