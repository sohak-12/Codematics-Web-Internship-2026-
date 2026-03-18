const Transaction = require("../models/Transaction");

const VALID_CATEGORIES = ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"];

// @desc Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = { userId: req.userId };

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: "Invalid category" });
      }
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start)) return res.status(400).json({ success: false, message: "Invalid startDate" });
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate + "T23:59:59.999Z");
        if (isNaN(end)) return res.status(400).json({ success: false, message: "Invalid endDate" });
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving transactions" });
  }
};

// @desc Create new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: "Please provide title, amount, category, and date" });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be a positive number" });
    }
    if (isNaN(new Date(date))) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const newTransaction = await Transaction.create({
      title: String(title).trim(),
      amount: Number(amount),
      category,
      date: new Date(date),
      notes: req.body.notes ? String(req.body.notes).trim() : "",
      userId: req.userId
    });
    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create transaction" });
  }
};

// @desc Get single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving transaction" });
  }
};

// @desc Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    const updateData = {};
    if (title)    updateData.title    = String(title).trim();
    if (amount)   updateData.amount   = Number(amount);
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: "Invalid category" });
      }
      updateData.category = category;
    }
    if (date)     updateData.date     = new Date(date);
    if (notes !== undefined) updateData.notes = String(notes).trim();

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: "Update failed" });
  }
};

// @desc Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// @desc Get stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats generation failed" });
  }
};
