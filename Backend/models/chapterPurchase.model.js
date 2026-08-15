import mongoose from 'mongoose';

const chapterPurchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

chapterPurchaseSchema.index({ user: 1, chapterId: 1 }, { unique: true });

export default mongoose.model('ChapterPurchase', chapterPurchaseSchema);
