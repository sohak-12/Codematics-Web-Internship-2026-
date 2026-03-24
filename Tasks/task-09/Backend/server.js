import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; 
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();

// CORS fix for Vercel
app.use(cors({
  origin: true, // Sab origins allow karein ya specifically front-end ka URL likhein
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/stats', statsRoutes);

// MongoDB Connection Logic for Serverless (Vercel)
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error("❌ MONGO_URI is missing from Environment Variables!");
}

// Global variable to keep connection alive
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    isConnected = true;
    console.log('✅ MongoDB connection established successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Initial connection attempt
connectDB();

app.get('/', (req, res) => {
  res.send('Library Management System API is running');
});

// Port handling for local vs production
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
  });
}

export default app;
