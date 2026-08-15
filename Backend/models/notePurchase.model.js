import mongoose from 'mongoose';

const notePurchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

notePurchaseSchema.index({ user: 1, note: 1 }, { unique: true });

export default mongoose.model('NotePurchase', notePurchaseSchema);
