const express = require('express');
const router = express.Router();
const {
  getArticlesByCategory,
  searchArticles,
  getTopHeadlines
} = require('../controllers/news.controller');

// Get articles by category
router.get('/category', getArticlesByCategory);

// Search articles
router.get('/search', searchArticles);

// Get top headlines
router.get('/headlines', getTopHeadlines);

module.exports = router;
