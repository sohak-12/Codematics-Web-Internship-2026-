const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    uptime: Math.round(process.uptime()) + "s"
  });
});

module.exports = router;
