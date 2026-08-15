import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: {
      type: [optionSchema],
      validate: [(arr) => arr.length >= 2 && arr.length <= 6, 'A question needs 2-6 options'],
    },
    correctOptionIndex: { type: Number, required: true }, // index into options[]
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // If set, only users enrolled in this course can attempt the quiz.
    // If null, the quiz is free/public.
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },

    timeLimitMinutes: { type: Number, default: 10 },
    questions: {
      type: [questionSchema],
      validate: [(arr) => arr.length > 0, 'A quiz needs at least one question'],
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
