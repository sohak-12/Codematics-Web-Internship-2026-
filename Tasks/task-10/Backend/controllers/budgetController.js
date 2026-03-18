const Budget = require("../models/Budget");

const VALID_CATEGORIES = ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"];

// Get all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId }).sort({ category: 1 });
    res.status(200).json({ success: true, count: budgets.length, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving budgets" });
  }
};

// Get a single budget
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.userId });
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found" });
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving budget" });
  }
};

// Create a new budget
exports.createBudget = async (req, res) => {
  const { category, monthlyLimit } = req.body;

  if (!category || !monthlyLimit) {
    return res.status(400).json({ success: false, message: "Please provide category and monthlyLimit" });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: "Invalid category" });
  }
  if (isNaN(monthlyLimit) || Number(monthlyLimit) < 1) {
    return res.status(400).json({ success: false, message: "Monthly limit must be at least 1" });
  }

  try {
    const budget = await Budget.create({
      category,
      monthlyLimit: Number(monthlyLimit),
      month: req.body.month,
      userId: req.userId
    });
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Budget for this category already exists" });
    }
    res.status(400).json({ success: false, message: "Failed to create budget" });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.monthlyLimit !== undefined) {
      if (isNaN(req.body.monthlyLimit) || Number(req.body.monthlyLimit) < 1) {
        return res.status(400).json({ success: false, message: "Monthly limit must be at least 1" });
      }
      updateData.monthlyLimit = Number(req.body.monthlyLimit);
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found" });
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update budget" });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!budget) return res.status(404).json({ success: false, message: "Budget not found" });
    res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete budget" });
  }
};

// Get budgets for current month
exports.getCurrentMonthBudgets = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay  = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const budgets = await Budget.find({
      userId: req.userId,
      createdAt: { $gte: firstDay, $lte: lastDay }
    });
    res.status(200).json({ success: true, count: budgets.length, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving current month budgets" });
  }
};
