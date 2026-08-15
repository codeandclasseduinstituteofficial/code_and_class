import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificate_no: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  father_name: { type: String, required: true },
  course: { type: String, required: true },
  date: { type: String, required: true },
  dob: { type: String, required: true },
  duration: { type: String, required: true },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Rejected'],
    default: 'Verified',
  },
});

export default mongoose.model('Certificate', certificateSchema);