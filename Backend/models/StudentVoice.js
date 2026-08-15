// models/StudentVoice.js

import mongoose from "mongoose";

const studentVoiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 200, // around 30 words
    },

    approved: {
      type: Boolean,
      default: false,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentVoice", studentVoiceSchema);