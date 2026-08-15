import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const Ngo = mongoose.model('Ngo', ngoSchema);

export default Ngo;
