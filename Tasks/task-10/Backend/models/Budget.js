const mongoose = require("mongoose");

/**
 * Budget Schema
 * Enhanced with better constraints, indexing for performance, 
 * and strict data sanitization.
 */
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Ideally, use mongoose.Schema.Types.ObjectId if referencing a User model
      required: [true, "User ID is required"],
      index: true, // Speeds up queries filtering by user
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true, // Removes accidental whitespace
      lowercase: true, // Ensures consistency in the database
      enum: {
        values: ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"],
        message: "{VALUE} is not a supported budget category",
      },
    },
    monthlyLimit: {
      type: Number,
      required: [true, "Monthly limit is mandatory"],
      min: [1, "Budget limit must be at least 1"], // Prevents 0 or negative budgets
    },
    month: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      },
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid month format. Expected YYYY-MM"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // Allows frontend to easily map data
    toObject: { virtuals: true }
  }
);

// Compound Index: one budget per category per user
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

// Virtual to link transactions (Optional, but highly impressive for dashboards)
budgetSchema.virtual('remaining', {
  ref: 'Transaction',
  localField: 'category',
  foreignField: 'category',
  justOne: false
});

module.exports = mongoose.model("Budget", budgetSchema);