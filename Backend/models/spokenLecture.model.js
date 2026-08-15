import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const spokenLectureSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  unitTitle: { type: String, required: true },
  chapters: [chapterSchema],
});

export default mongoose.model('SpokenLecture', spokenLectureSchema);