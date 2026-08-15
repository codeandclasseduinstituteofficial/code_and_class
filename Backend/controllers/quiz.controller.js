import asyncHandler from 'express-async-handler';
import Quiz from '../models/quiz.model.js';
import QuizAttempt from '../models/quizAttempt.model.js';
import Enrollment from '../models/enrollment.model.js';

// ---------- Admin ----------

// @desc  Create a quiz (leave `course` empty/null for a free public quiz)
// @route POST /api/quizzes
// @access Private/Admin
export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(quiz);
});

// @desc  Update a quiz
// @route PUT /api/quizzes/:id
// @access Private/Admin
export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(quiz);
});

// @desc  Delete a quiz
// @route DELETE /api/quizzes/:id
// @access Private/Admin
export const deleteQuiz = asyncHandler(async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  await QuizAttempt.deleteMany({ quiz: req.params.id });
  res.json({ message: 'Quiz deleted' });
});

// @desc  Admin: full quiz detail including correct answers
// @route GET /api/quizzes/:id/admin
// @access Private/Admin
export const getQuizForAdmin = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  res.json(quiz);
});

// ---------- Public / Student ----------

// @desc  List all published quizzes (free ones for everyone, course quizzes flagged as locked/unlocked)
// @route GET /api/quizzes
// @access Public (more info shown if logged in)
export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ isPublished: true })
    .select('title description course timeLimitMinutes questions')
    .populate('course', 'title course');

  let unlockedCourseIds = [];
  if (req.user) {
    const enrollments = await Enrollment.find({ user: req.user.id }).select('course');
    unlockedCourseIds = enrollments.map((e) => e.course.toString());
  }

  const shaped = quizzes.map((q) => ({
    _id: q._id,
    title: q.title,
    description: q.description,
    course: q.course,
    timeLimitMinutes: q.timeLimitMinutes,
    questionCount: q.questions.length,
    isFree: !q.course,
    isLocked: q.course ? !unlockedCourseIds.includes(q.course._id.toString()) : false,
  }));

  res.json(shaped);
});

// @desc  Get a quiz to attempt — correct answers are stripped out
// @route GET /api/quizzes/:id
// @access Private (Public if the quiz is free)
export const getQuizToAttempt = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz || !quiz.isPublished) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.course) {
    if (!req.user) {
      res.status(401);
      throw new Error('Please log in to attempt this quiz');
    }
    const enrolled = await Enrollment.findOne({ user: req.user.id, course: quiz.course });
    if (!enrolled) {
      res.status(403);
      throw new Error('Enroll in this course to attempt the quiz');
    }
  }

  const sanitized = {
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    timeLimitMinutes: quiz.timeLimitMinutes,
    questions: quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map((o) => ({ _id: o._id, text: o.text })),
    })),
  };

  res.json(sanitized);
});

// @desc  Submit answers, get scored server-side, save attempt history
// @route POST /api/quizzes/:id/submit
// @access Private
export const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body; // [{ questionId, selectedOptionIndex }]

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.course) {
    const enrolled = await Enrollment.findOne({ user: req.user.id, course: quiz.course });
    if (!enrolled) {
      res.status(403);
      throw new Error('Enroll in this course to attempt the quiz');
    }
  }

  let score = 0;
  const gradedAnswers = quiz.questions.map((q) => {
    const submitted = answers.find((a) => a.questionId === q._id.toString());
    const selectedOptionIndex = submitted ? Number(submitted.selectedOptionIndex) : -1;
    const isCorrect = selectedOptionIndex === Number(q.correctOptionIndex);
    if (isCorrect) score += 1;
    return { question: q._id, selectedOptionIndex, isCorrect };
  });

  const totalQuestions = quiz.questions.length;
  const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

  const attempt = await QuizAttempt.create({
    user: req.user.id,
    quiz: quiz._id,
    answers: gradedAnswers,
    score,
    totalQuestions,
    percentage,
  });

  res.status(201).json({
    score,
    totalQuestions,
    percentage,
    attemptId: attempt._id,
    // Reveal correct answers only after submission, for review
    correctAnswers: quiz.questions.map((q) => ({
      questionId: q._id,
      correctOptionIndex: q.correctOptionIndex,
    })),
  });
});

// @desc  Get the logged-in user's quiz attempt history
// @route GET /api/quizzes/attempts/my
// @access Private
export const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user.id })
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });
  res.json(attempts);
});
