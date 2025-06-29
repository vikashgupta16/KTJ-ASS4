// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../backend/db');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
}

// Import routes
const authRoutes = require('../backend/routes/auth.routes');
const userRoutes = require('../backend/routes/user.routes');
const summarizerRoutes = require('../backend/routes/summarizer.routes');
const newsRoutes = require('../backend/routes/news.routes');

const app = express();

// Connect to MongoDB (for serverless, connection should be cached)
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  cachedDb = await connectDB();
  return cachedDb;
}

// Connect to database
connectToDatabase();

// Middleware
app.use(cors({
  origin: [
    'https://ktj-ass-4.vercel.app',
    'https://ktj-ass-4-z82a.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'News Dashboard API is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/summarizer', summarizerRoutes);
app.use('/api/news', newsRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to News Dashboard API on Vercel',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      summarizer: '/api/summarizer',
      news: '/api/news',
      health: '/health'
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

module.exports = app;
