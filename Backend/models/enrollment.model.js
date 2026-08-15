import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    mode: { type: String, enum: ['online', 'offline'], default: 'offline' },
    source: {
      type: String,
      enum: ['purchase', 'admin-granted', 'free'],
      default: 'purchase',
    },
    progress: {
      type: Number, // percentage 0-100, kept simple for now
      default: 0,
    },
  },
  { timestamps: true }
);

// A user can only be enrolled once per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
