const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Default to a local MongoDB if MONGODB_URI is not set
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-dashboard';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.warn('⚠️  MongoDB not available. Some features requiring database will not work.');
    console.log('💡 To enable full functionality:');
    console.log('   1. Install MongoDB locally or use MongoDB Atlas');
    console.log('   2. Set MONGODB_URI in .env.local');
    console.log('   3. Restart the server');
    
    // Don't exit in development - let the server run without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
