import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  contact: { type: String, required: true },
  issuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }]
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);