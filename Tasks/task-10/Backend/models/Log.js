const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  color: { type: String, default: "#3498db" } // UI ke liye extra feature
}, { timestamps: true });

// Prevent duplicate categories for the same user
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);