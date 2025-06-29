const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

// Load environment variables from parent directory
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const summarizerRoutes = require('./routes/summarizer.routes');
const newsRoutes = require('./routes/news.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.PRODUCTION_FRONTEND_URL || 'https://ktj-ass-4.vercel.app',
    'https://ktj-ass-4.vercel.app', // Main frontend URL
    'https://ktj-ass-4-z82a.vercel.app', // Backend URL for dev testing
    'https://ktj-ass-4-alpha-coders-projects-fae97fae.vercel.app', // Old URL for backwards compatibility
    'http://localhost:5174'  // Vite dev server fallback
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'News Dashboard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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
    message: 'Welcome to News Dashboard API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      summarizer: '/api/summarizer',
      health: '/health'
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 News Dashboard API Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health Check: http://localhost:${PORT}/health
📖 API Docs: http://localhost:${PORT}/
  `);
});

module.exports = app;
