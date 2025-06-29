const mongoose = require('mongoose');

const savedArticleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  article: {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    content: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Article URL is required'],
      trim: true
    },
    urlToImage: {
      type: String,
      trim: true
    },
    publishedAt: {
      type: Date,
      required: [true, 'Published date is required']
    },
    source: {
      name: {
        type: String,
        required: [true, 'Source name is required'],
        trim: true
      },
      id: {
        type: String,
        trim: true
      }
    },
    author: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['general', 'business', 'technology', 'sports', 'health', 'entertainment', 'science'],
      default: 'general'
    }
  },
  summary: {
    content: {
      type: String,
      required: [true, 'Summary content is required'],
      trim: true,
      maxlength: [2000, 'Summary cannot exceed 2000 characters']
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    model: {
      type: String,
      default: 'gemini-pro',
      trim: true
    },
    bulletPoints: [{
      type: String,
      trim: true
    }]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  readingStatus: {
    type: String,
    enum: ['unread', 'reading', 'read'],
    default: 'unread'
  },
  readingTime: {
    type: Number, // in minutes
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for user and article URL to prevent duplicates
savedArticleSchema.index({ user: 1, 'article.url': 1 }, { unique: true });

// Create index for searching
savedArticleSchema.index({ 
  'article.title': 'text', 
  'article.description': 'text', 
  'summary.content': 'text',
  'tags': 'text'
});

// Create index for filtering by category and date
savedArticleSchema.index({ 'article.category': 1, createdAt: -1 });

// Update the updatedAt field before saving
savedArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Extract bullet points from summary content
savedArticleSchema.pre('save', function(next) {
  if (this.summary && this.summary.content) {
    const bulletPoints = this.summary.content
      .split('\n')
      .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
      .map(line => line.replace(/^[•\-]\s*/, '').trim())
      .filter(point => point.length > 0);
    
    this.summary.bulletPoints = bulletPoints;
  }
  next();
});

// Virtual for calculating days since saved
savedArticleSchema.virtual('daysSaved').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Static method to find articles by user
savedArticleSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ user: userId });
  
  if (options.category) {
    query.where('article.category', options.category);
  }
  
  if (options.isFavorite !== undefined) {
    query.where('isFavorite', options.isFavorite);
  }
  
  if (options.readingStatus) {
    query.where('readingStatus', options.readingStatus);
  }
  
  if (options.search) {
    query.where({
      $text: { $search: options.search }
    });
  }
  
  // Default sorting by creation date (newest first)
  const sortBy = options.sortBy || '-createdAt';
  query.sort(sortBy);
  
  if (options.limit) {
    query.limit(options.limit);
  }
  
  if (options.populate) {
    query.populate('user', 'username email firstName lastName');
  }
  
  return query;
};

// Instance method to mark as read
savedArticleSchema.methods.markAsRead = function() {
  this.readingStatus = 'read';
  return this.save();
};

// Instance method to toggle favorite status
savedArticleSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

module.exports = mongoose.model('SavedArticle', savedArticleSchema);
