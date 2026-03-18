const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { userId: req.userId } },
      { 
        $group: {
          _id: null,
          totalSpending: { $sum: "$amount" },
          avgSpending: { $avg: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats generation failed" });
  }
});

module.exports = router;
