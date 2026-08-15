import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },

    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOptionIndex: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],

    score: { type: Number, required: true }, // number of correct answers
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('QuizAttempt', quizAttemptSchema);
