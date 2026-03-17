import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ['Active', 'Returned'], default: 'Active' },
  fine: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Issue', issueSchema);