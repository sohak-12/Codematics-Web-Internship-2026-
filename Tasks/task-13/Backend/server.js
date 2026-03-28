require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const feedbackRoutes = require("./routes/feedbackRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const healthRoutes = require("./routes/health");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:3000"].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/interviews", interviewRoutes);

// Local dev
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel serverless
module.exports = app;
