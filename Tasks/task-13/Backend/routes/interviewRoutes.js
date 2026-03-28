const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserInterviews, getAdminStats } = require("../controllers/interviewController");

router.get("/", authMiddleware, getUserInterviews);
router.get("/admin/stats", authMiddleware, getAdminStats);

module.exports = router;
