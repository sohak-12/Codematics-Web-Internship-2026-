const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createFeedback, getFeedback } = require("../controllers/feedbackController");

router.post("/", authMiddleware, createFeedback);
router.get("/:id", authMiddleware, getFeedback);

module.exports = router;
