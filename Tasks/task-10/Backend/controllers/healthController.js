/**
 * @desc    Check server health
 * @route   GET /api/health
 */
exports.checkHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "System is fully operational",
    uptime: process.uptime(),
    status: "OK"
  });
};