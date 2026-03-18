const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // CWE-352: Enforce token comes strictly from Authorization header only
    // Reject any token passed via cookies or query params
    if (req.cookies?.token || req.query?.token) {
      return res.status(401).json({
        success: false,
        message: "Token must be provided via Authorization header only"
      });
    }

    const authHeader = req.headers.authorization;

    // CWE-843: Guard typeof before calling string methods
    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid format"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed or token expired"
    });
  }
};

module.exports = authMiddleware;
