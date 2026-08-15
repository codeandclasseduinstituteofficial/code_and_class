import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/order.model.js';
import Course from '../models/course.model.js';
import Note from '../models/note.model.js';
import Lecture from '../models/lectures.model.js';
import Enrollment from '../models/enrollment.model.js';
import NotePurchase from '../models/notePurchase.model.js';
import ChapterPurchase from '../models/chapterPurchase.model.js';
import CourseApplication from '../models/courseApplication.model.js';
import TutionForm from '../models/tutionForm.model.js';
import TossApplication from '../models/tossApplication.model.js';
import ClassTen from '../models/classTenth.model.js';
import Intermediate from '../models/Intermediate.model.js';
import Purchase from '../models/Purchase.model.js';
import Quiz from '../models/quiz.model.js';

const applicationModels = {
  course: CourseApplication,
  tuition: TutionForm,
  toss: TossApplication,
};

// Built lazily (on first use, per request) rather than at module-import time.
// If this were built eagerly at the top of the file, it would run during the
// import phase — before index.js's dotenv setup has necessarily executed —
// and would silently lock in `undefined` API keys for the app's whole lifetime.
let razorpayInstance = null;
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      'Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env and restart the server.'
    );
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Extract a plain rupee number out of price fields like "₹4,999" or "4999"
const parsePriceToRupees = (priceStr) => {
  const digits = String(priceStr).replace(/[^\d.]/g, '');
  const value = Number(digits);
  return Number.isFinite(value) ? value : 0;
};

// @desc  Create a Razorpay order for a course purchase
// @route POST /api/payments/create-order
// @access Private (logged in user)
export const createOrder = asyncHandler(async (req, res) => {
  const { courseId, isOnlineCourse } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Prevent double purchase
  const alreadyEnrolled = await Enrollment.findOne({ user: req.user.id, course: course._id });
  if (alreadyEnrolled) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // `course.price` is already the final amount the student pays.
  // `course.discount` is just a percentage badge shown next to it — never a price.
  // const rupees = parsePriceToRupees(course.price);

  // if (rupees <= 0) {
  //   res.status(400);
  //   throw new Error('This course does not have a valid price set');
  // }

  // const coursePrice = parsePriceToRupees(course.price);

  // If frontend sends an amount (Online Courses),
  // use it. Otherwise use the normal course price.
  // const finalAmount = amount || coursePrice;

  const coursePrice = parsePriceToRupees(course.price);

  // ₹1000 platform fee only for online courses
  const platformFee = isOnlineCourse ? 1000 : 0;

  const finalAmount = coursePrice + platformFee;

  if (finalAmount <= 0) {
    res.status(400);
    throw new Error('Invalid payment amount');
  }

  const amountInPaise = Math.round(finalAmount * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: 'INR',
      // Razorpay caps `receipt` at 40 characters — keep this short.
      receipt: `rcpt_${course._id.toString().slice(-10)}_${Date.now()}`,
    });
  } catch (err) {
    // The Razorpay SDK throws plain objects, not Error instances, so a bare
    // `throw err` here would reach the client as an empty {} response body.
    const description = err?.error?.description || err?.message || 'Failed to create the payment order';
    res.status(err?.statusCode || 500);
    throw new Error(description);
  }

  const order = await Order.create({
    user: req.user.id,
    itemType: 'course',
    course: course._id,
    mode: isOnlineCourse ? 'online' : 'offline',
    amount: amountInPaise,
    currency: 'INR',
    razorpayOrderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    status: 'created',
  });

  res.status(201).json({
    orderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    dbOrderId: order._id,
    courseTitle: course.title,
  });
});

// @desc  Create a Razorpay order for a paid note
// @route POST /api/payments/create-note-order
// @access Private (logged in user)
export const createNoteOrder = asyncHandler(async (req, res) => {
  const { noteId } = req.body;

  const note = await Note.findById(noteId);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  if (!note.isPaid) {
    res.status(400);
    throw new Error('This note is free — no payment needed');
  }

  const alreadyPurchased = await NotePurchase.findOne({ user: req.user.id, note: note._id });
  if (alreadyPurchased) {
    res.status(400);
    throw new Error('You already own this note');
  }

  const rupees = Number(note.price);
  if (!Number.isFinite(rupees) || rupees <= 0) {
    res.status(400);
    throw new Error('This note does not have a valid price set');
  }

  const amountInPaise = Math.round(rupees * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${note._id.toString().slice(-10)}_${Date.now()}`,
    });
  } catch (err) {
    const description = err?.error?.description || err?.message || 'Failed to create the payment order';
    res.status(err?.statusCode || 500);
    throw new Error(description);
  }

  const order = await Order.create({
    user: req.user.id,
    itemType: 'note',
    note: note._id,
    amount: amountInPaise,
    currency: 'INR',
    razorpayOrderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    status: 'created',
  });

  res.status(201).json({
    orderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    dbOrderId: order._id,
    noteTitle: note.title,
  });
});

// @desc  Create a Razorpay order to unlock a paid lecture chapter
// @route POST /api/payments/create-chapter-order
// @access Private (logged in user)
export const createChapterOrder = asyncHandler(async (req, res) => {
  const { lectureId, chapterId } = req.body;

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    res.status(404);
    throw new Error('Lecture unit not found');
  }

  const chapter = lecture.chapters.id(chapterId);
  if (!chapter) {
    res.status(404);
    throw new Error('Chapter not found');
  }

  if (!chapter.isPaid) {
    res.status(400);
    throw new Error('This chapter is free — no payment needed');
  }

  const alreadyPurchased = await ChapterPurchase.findOne({ user: req.user.id, chapterId: chapter._id });
  if (alreadyPurchased) {
    res.status(400);
    throw new Error('You already have access to this chapter');
  }

  const rupees = Number(chapter.price);
  if (!Number.isFinite(rupees) || rupees <= 0) {
    res.status(400);
    throw new Error('This chapter does not have a valid price set');
  }

  const amountInPaise = Math.round(rupees * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${chapter._id.toString().slice(-10)}_${Date.now()}`,
    });
  } catch (err) {
    const description = err?.error?.description || err?.message || 'Failed to create the payment order';
    res.status(err?.statusCode || 500);
    throw new Error(description);
  }

  const order = await Order.create({
    user: req.user.id,
    itemType: 'chapter',
    lecture: lecture._id,
    chapterId: chapter._id,
    amount: amountInPaise,
    currency: 'INR',
    razorpayOrderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    status: 'created',
  });

  res.status(201).json({
    orderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    dbOrderId: order._id,
    chapterTitle: chapter.title,
  });
});


// @desc  Create a Razorpay order to unlock a paid Class 10 problem, Intermediate
//        topic video, or a paid quiz
// @route POST /api/payments/create-topic-order
// @access Private (logged in user)
export const createTopicOrder = asyncHandler(async (req, res) => {
  const { contentId, contentType } = req.body;

  if (!['Class10', 'Intermediate', 'Quiz'].includes(contentType)) {
    res.status(400);
    throw new Error('Invalid content type');
  }

  let item;
  let notFoundMessage;
  let freeMessage;

  if (contentType === 'Quiz') {
    notFoundMessage = 'Quiz not found';
    freeMessage = 'This quiz is free — no payment needed';

    item = await Quiz.findById(contentId);
    if (!item) {
      res.status(404);
      throw new Error(notFoundMessage);
    }
  } else {
    notFoundMessage = 'Video not found';
    freeMessage = 'This video is free — no payment needed';

    const Model = contentType === 'Class10' ? ClassTen : Intermediate;
    const arrayPath = contentType === 'Class10' ? 'problems' : 'topics';
    const chaptersPath = contentType === 'Class10' ? 'chapters.problems' : 'chapters.topics';

    const doc = await Model.findOne({ [`${chaptersPath}._id`]: contentId });
    if (!doc) {
      res.status(404);
      throw new Error(notFoundMessage);
    }

    doc.chapters.forEach((chapter) => {
      chapter[arrayPath].forEach((entry) => {
        if (entry._id.toString() === contentId) item = entry;
      });
    });

    if (!item) {
      res.status(404);
      throw new Error(notFoundMessage);
    }
  }

  if (!item.isPaid) {
    res.status(400);
    throw new Error(freeMessage);
  }

  const alreadyPurchased = await Purchase.findOne({
    user: req.user.id,
    contentId,
    contentType,
    paymentStatus: 'success',
  });
  if (alreadyPurchased) {
    res.status(400);
    throw new Error(contentType === 'Quiz' ? 'You already have access to this quiz' : 'You already have access to this video');
  }

  const rupees = Number(item.price);
  if (!Number.isFinite(rupees) || rupees <= 0) {
    res.status(400);
    throw new Error(contentType === 'Quiz' ? 'This quiz does not have a valid price set' : 'This video does not have a valid price set');
  }

  const amountInPaise = Math.round(rupees * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${contentId.toString().slice(-10)}_${Date.now()}`,
    });
  } catch (err) {
    const description = err?.error?.description || err?.message || 'Failed to create the payment order';
    res.status(err?.statusCode || 500);
    throw new Error(description);
  }

  const order = await Order.create({
    user: req.user.id,
    itemType: 'topic',
    contentId,
    contentType,
    amount: amountInPaise,
    currency: 'INR',
    razorpayOrderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    status: 'created',
  });

  res.status(201).json({
    orderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    dbOrderId: order._id,
    videoTitle: item.name || item.topicName || item.title,
  });
});

// @desc  Create a Razorpay order to pay an application fee (course/tuition/TOSS)
// @route POST /api/payments/create-application-order
// @access Private (must be logged in to pay online; offline applicants skip this)
export const createApplicationOrder = asyncHandler(async (req, res) => {
  const { applicationType, applicationId } = req.body;

  const Model = applicationModels[applicationType];
  if (!Model) {
    res.status(400);
    throw new Error('Invalid application type');
  }

  const application = await Model.findById(applicationId);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.paymentMode !== 'online') {
    res.status(400);
    throw new Error('This application was not submitted with online payment');
  }

  if (application.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('This application has already been paid for');
  }

  const rupees = Number(application.applicationFee);
  if (!Number.isFinite(rupees) || rupees <= 0) {
    res.status(400);
    throw new Error('This application does not have a valid fee set');
  }

  const amountInPaise = Math.round(rupees * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${applicationId.toString().slice(-10)}_${Date.now()}`,
    });
  } catch (err) {
    const description = err?.error?.description || err?.message || 'Failed to create the payment order';
    res.status(err?.statusCode || 500);
    throw new Error(description);
  }

  const order = await Order.create({
    user: req.user.id,
    itemType: 'application',
    applicationType,
    applicationId: application._id,
    amount: amountInPaise,
    currency: 'INR',
    razorpayOrderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    status: 'created',
  });

  res.status(201).json({
    orderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    dbOrderId: order._id,
  });
});


// @route POST /api/payments/verify
// @access Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing payment verification fields');
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    order.status = 'failed';
    await order.save();
    res.status(400);
    throw new Error('Payment verification failed');
  }

  order.status = 'paid';
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  try {
    if (order.itemType === 'topic') {
      await Purchase.create({
        user: order.user,
        contentId: order.contentId,
        contentType: order.contentType,
        amount: order.amount / 100,
        paymentStatus: 'success',
        paymentId: order.razorpayPaymentId,
      });
    } else if (order.itemType === 'note') {
      await NotePurchase.create({ user: order.user, note: order.note, order: order._id });
    } else if (order.itemType === 'chapter') {
      await ChapterPurchase.create({
        user: order.user,
        lecture: order.lecture,
        chapterId: order.chapterId,
        order: order._id,
      });
    } else if (order.itemType === 'application') {
      const Model = applicationModels[order.applicationType];
      if (Model) {
        await Model.findByIdAndUpdate(order.applicationId, {
          paymentStatus: 'paid',
          order: order._id,
        });
      }
    } else {
      await Enrollment.create({
        user: order.user,
        course: order.course,
        order: order._id,
        mode: order.mode,
        source: 'purchase',
      });
    }
  } catch (err) {
    if (err.code !== 11000) throw err; // ignore "already unlocked" race, rethrow anything else
  }

  res.json({ success: true, message: 'Payment verified!' });
});

// @desc  Get the logged-in user's orders
// @route GET /api/payments/my-orders
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('course', 'title thumbnail course')
    .populate('note', 'title image')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Admin: view all orders
// @route GET /api/payments
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('course', 'title')
    .populate('note', 'title')
    .sort({ createdAt: -1 });
  res.json(orders);
});