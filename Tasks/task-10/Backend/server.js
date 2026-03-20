const express = require("express");
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

/* ─── 2. MANUAL CORS (No Package Needed) ───────────────── */
app.use((req, res, next) => {
  // Aapka exact frontend URL
  const origin = req.headers.origin;
  const allowedOrigins = ["https://sohanix-wealth.vercel.app", "http://localhost:3000"];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight check
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

/* ─── 3. MIDDLEWARE ────────────────────────────────────── */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(express.json({ limit: "10kb" }));

/* ─── 4. API ROUTES ────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Sohanix Wealth API is Live!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/budgets", authMiddleware, budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/health", healthRoutes);

/* ─── 5. ERROR HANDLING ────────────────────────────────── */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
