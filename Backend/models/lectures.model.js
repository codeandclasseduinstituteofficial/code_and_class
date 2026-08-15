import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 }, // rupees; ignored when isPaid is false
});

const lectureSchema = new mongoose.Schema({
  classLevel: {
    type: String,
    enum: ['Class-10', 'Intermediate'],
    required: true,
  },
  unitTitle: { type: String, required: true },
  chapters: [chapterSchema],
});

export default mongoose.model('Lecture', lectureSchema);