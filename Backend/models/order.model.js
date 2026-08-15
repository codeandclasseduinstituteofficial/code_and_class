import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    itemType: { type: String, enum: ['course', 'note', 'chapter', 'application', 'topic'], default: 'course' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    // Mode of study the student picked when buying a course ('course' itemType only)
    mode: { type: String, enum: ['online', 'offline'], default: 'offline' },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
    chapterId: { type: mongoose.Schema.Types.ObjectId },
    applicationType: { type: String, enum: ['course', 'tuition', 'toss'] },
    applicationId: { type: mongoose.Schema.Types.ObjectId },

    // Used when itemType === 'topic' (Class 10 problem or Intermediate topic video)
    contentId: { type: String },
    contentType: { type: String, enum: ['Class10', 'Intermediate'] },

    // Amount stored in paise (smallest currency unit) to match Razorpay convention
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },

    receipt: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
