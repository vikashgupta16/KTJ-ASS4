const express = require('express');
const router = express.Router();
const { 
  getUserStats,
  getSavedArticles,
  searchArticles,
  getPreferences,
  updatePreferences,
  deleteAccount
} = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

// User statistics and dashboard data
router.get('/stats', getUserStats);

// Saved articles management
router.get('/articles', getSavedArticles);
router.get('/articles/search', searchArticles);

// User preferences
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

// Account management
router.delete('/account', deleteAccount);

module.exports = router;
