const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  icon: { type: String, default: "default-icon" } // Extra feature: Custom icons for UI
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);