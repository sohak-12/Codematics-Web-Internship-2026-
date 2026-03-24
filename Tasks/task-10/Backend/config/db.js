const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    isConnected = false;
    throw error;
  }
};

module.exports = connectDB;
