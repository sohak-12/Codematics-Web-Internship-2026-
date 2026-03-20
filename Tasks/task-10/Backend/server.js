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

app.use(cors({
  origin: true,
  credentials: true
}));

// OPTIONS requests handle karne ke liye (Important for Preflight)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header('Origin'));
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}));

app.use(express.json({ limit: "10kb" }));

/* ─── 3. API ROUTES ────────────────────────────────────── */

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
    message: err.message || "Internal Server Error"
  });
});

/* ─── 5. SERVER INITIALIZATION ─────────────────────────── */
const PORT = process.env.PORT || 5000;

// Vercel handles the listening, so we only listen locally
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
