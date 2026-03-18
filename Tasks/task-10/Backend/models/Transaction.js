const mongoose = require("mongoose");

/**
 * Transaction Schema
 * Optimized for high-frequency read/write operations and advanced filtering.
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Crucial for multi-tenant isolation
    },
    title: {
      type: String,
      required: [true, "Title is mandatory"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
      // Optional: use Decimal128 for financial precision if needed
    },
    category: {
      type: String,
      required: true,
      index: true, // Speeds up categorical dashboard breakdown
      enum: {
        values: ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"],
        message: "{VALUE} is not a valid category",
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // Speeds up date-range filtering (startDate/endDate)
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
  },
  { 
    timestamps: true 
  }
);

// Compound Indexing for Dashboard Analytics
// This dramatically speeds up queries like "Show my food expenses for March"
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);