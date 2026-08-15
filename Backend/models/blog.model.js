import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        summary: {
            type: String,
            default: "",
        },

        content: {
            type: String,
            required: true,
        },

        // Google Drive link for the cover image
        imageUrl: {
            type: String,
            default: "",
        },

        // YouTube link for an embedded video, if any
        videoUrl: {
            type: String,
            default: "",
        },

        author: {
            type: String,
            default: "Code and Class",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
