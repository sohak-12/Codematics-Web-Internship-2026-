const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Mocking standard categories for now, or fetch from DB
router.get("/", authMiddleware, (req, res) => {
  const categories = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Shopping"];
  res.status(200).json({ success: true, data: categories });
});

module.exports = router;