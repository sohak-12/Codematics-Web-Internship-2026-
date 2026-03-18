const Transaction = require("../models/Transaction");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats calculation error" });
  }
};
