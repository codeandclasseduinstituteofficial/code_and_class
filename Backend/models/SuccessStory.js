// models/SuccessStory.js

import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema(
    {
        videoUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SuccessStory", successStorySchema);