import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  driveLink: {
    type: String,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number, // rupees; ignored when isPaid is false
    default: 0,
  },
}, {
  timestamps: true
});

const Note = mongoose.model('Note', noteSchema);

export default Note;