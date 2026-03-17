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
const PORT = process.env.PORT || 5001;

// 2. Phir middleware
app.use(cors()); 
app.use(express.json());

// --- Middleware ---
// Configured to explicitly allow your frontend origin
app.use(cors({
origin: ['http://localhost:3000', 'http://localhost:3001'],
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library')
  .then(() => console.log('MongoDB connection established successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Library Management System API is running');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});