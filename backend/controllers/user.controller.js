const User = require('../models/user.model');
const SavedArticle = require('../models/savedArticle.model');

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get article statistics
    const totalSaved = await SavedArticle.countDocuments({ user: userId });
    const totalRead = await SavedArticle.countDocuments({ 
      user: userId, 
      readingStatus: 'read' 
    });
    const totalFavorites = await SavedArticle.countDocuments({ 
      user: userId, 
      isFavorite: true 
    });

    // Get category breakdown
    const categoryStats = await SavedArticle.aggregate([
      { $match: { user: userId } },
      { $group: { 
          _id: '$article.category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await SavedArticle.countDocuments({
      user: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get most active day
    const dailyStats = await SavedArticle.aggregate([
      { 
        $match: { 
          user: userId,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      data: {
        user: req.user.toJSON(),
        statistics: {
          totalSaved,
          totalRead,
          totalFavorites,
          readingProgress: totalSaved > 0 ? Math.round((totalRead / totalSaved) * 100) : 0,
          recentActivity,
          categoryBreakdown: categoryStats,
          mostActiveDay: dailyStats[0] || null
        }
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};

// Get user's saved articles with filters
const getSavedArticles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      category, 
      isFavorite, 
      readingStatus, 
      search, 
      sortBy, 
      page = 1, 
      limit = 10 
    } = req.query;

    const options = {
      category,
      isFavorite: isFavorite !== undefined ? isFavorite === 'true' : undefined,
      readingStatus,
      search,
      sortBy,
      limit: parseInt(limit),
      populate: false
    };

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = SavedArticle.findByUser(userId, options);
    query = query.skip(skip);

    const articles = await query.exec();
    const total = await SavedArticle.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get saved articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved articles'
    });
  }
};

// Search user's articles
const searchArticles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { q, category, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchOptions = {
      search: q.trim(),
      category,
      limit: parseInt(limit)
    };

    const articles = await SavedArticle.findByUser(userId, searchOptions);

    res.json({
      success: true,
      data: {
        articles,
        searchQuery: q.trim(),
        totalResults: articles.length
      }
    });
  } catch (error) {
    console.error('Search articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};

// Get user preferences
const getPreferences = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch preferences'
    });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const { favoriteCategories, language, country } = req.body;
    const userId = req.user._id;

    const updateData = {
      preferences: {
        ...req.user.preferences,
        ...(favoriteCategories && { favoriteCategories }),
        ...(language && { language }),
        ...(country && { country })
      }
    };

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const user = await User.findById(userId);
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete all user's saved articles
    await SavedArticle.deleteMany({ user: userId });
    
    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

module.exports = {
  getUserStats,
  getSavedArticles,
  searchArticles,
  getPreferences,
  updatePreferences,
  deleteAccount
};
