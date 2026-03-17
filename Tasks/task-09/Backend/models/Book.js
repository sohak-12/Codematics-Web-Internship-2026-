import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  availabilityStatus: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);