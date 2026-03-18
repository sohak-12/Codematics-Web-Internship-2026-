const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categories");
const statsRoutes = require("./routes/stats");
const healthRoutes = require("./routes/health");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

/* ─── 1. DATABASE CONNECTION ───────────────────────────── */
connectDB();

/* ─── 2. SECURITY & MIDDLEWARE ─────────────────────────── */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "https://sohanix-wealth.vercel.app"
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// FIX: Helmet ko customize kiya taake CORS block na ho
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}));

// Body parser
app.use(express.json({ limit: "10kb" }));

// CSRF Protection
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const contentType = req.headers["content-type"];
    if (typeof contentType !== "string" || !contentType.includes("application/json")) {
      return res.status(415).json({ success: false, message: "Unsupported Media Type" });
    }
  }
  next();
});

/* ─── 3. API ROUTES ────────────────────────────────────── */

// Welcome Route (Fixes "Cannot GET /" screen)
app.get("/", (req, res) => {
  res.json({ success: true, message: "Sohanix Wealth API is Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/budgets", authMiddleware, budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/health", healthRoutes);

/* ─── 4. CENTRALIZED ERROR HANDLING ────────────────────── */
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message
  });
});

/* ─── 5. SERVER INITIALIZATION ─────────────────────────── */
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

/* ─── 6. GRACEFUL SHUTDOWN ──────────────────────────────── */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

module.exports = app;
