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

// --- Middleware ---
// Yahan origin mein apne Vercel frontend ka URL zaroor add karein
app.use(cors({
  origin: ['http://localhost:3000', 'https://sohas-atheneum.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/stats', statsRoutes);

// --- Database Connection ---
// process.env.MONGO_URI (Vercel settings wala name)
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/library';

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB connection established successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Library Management System API is running');
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
  });
}

export default app;