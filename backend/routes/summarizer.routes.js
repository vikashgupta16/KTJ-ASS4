const express = require('express');
const router = express.Router();
const {
  generateSummary,
  saveArticleWithSummary,
  getSavedArticle,
  updateSavedArticle,
  deleteSavedArticle,
  batchUpdateArticles,
  extractArticleContent,
  generateSummaryWithFullContent
} = require('../controllers/summarizer.controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// Public summary generation (doesn't require auth)
router.post('/generate', optionalAuth, generateSummary);

// Extract full article content (public endpoint)
router.post('/extract', extractArticleContent);

// Generate summary with full content extraction (public endpoint)
router.post('/generate-full', optionalAuth, generateSummaryWithFullContent);

// Protected routes (require authentication)
router.use(authMiddleware);

// Article management with summaries
router.post('/save', saveArticleWithSummary);
router.get('/article/:articleId', getSavedArticle);
router.put('/article/:articleId', updateSavedArticle);
router.delete('/article/:articleId', deleteSavedArticle);

// Batch operations
router.put('/articles/batch', batchUpdateArticles);

module.exports = router;
