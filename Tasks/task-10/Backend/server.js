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

/* ─── 2. DYNAMIC CORS FIX (Works with Vercel Preview URLs) ───────────── */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow your production frontend
  const productionOrigins = [
    "https://sohanix-wealth.vercel.app",
    "http://localhost:3000"
  ];
  
  // Allow ANY Vercel preview URL (sohanixwealth-*.vercel.app)
  const isVercelPreview = origin && origin.includes("sohanixwealth-") && origin.includes(".vercel.app");
  
  if (productionOrigins.includes(origin) || isVercelPreview) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // CRITICAL: Handle the Preflight (OPTIONS) request immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

/* ─── 3. MIDDLEWARE ────────────────────────────────────── */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Security headers - specialized for Cross-Origin
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(express.json({ limit: "10kb" }));

/* ─── 4. API ROUTES ────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Sohanix Wealth API is Active!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/budgets", authMiddleware, budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/health", healthRoutes);

/* ─── 5. CENTRALIZED ERROR HANDLING ────────────────────── */
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message
  });
});

/* ─── 6. SERVER INITIALIZATION ─────────────────────────── */
const PORT = process.env.PORT || 5000;
// Note: Vercel doesn't use app.listen, it uses the exported module.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
module.exports = app;
