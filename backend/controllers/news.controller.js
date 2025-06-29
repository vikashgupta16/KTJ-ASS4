const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_BASE_URL = 'https://newsapi.org/v2';

// Create axios instance for NewsAPI
const newsApiClient = axios.create({
  baseURL: NEWS_BASE_URL,
  timeout: 10000,
  headers: {
    'X-API-Key': NEWS_API_KEY
  }
});

// Get articles by category
const getArticlesByCategory = async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'News API key is not configured on the server'
      });
    }

    const { category = 'general', country = 'us' } = req.query;

    const response = await newsApiClient.get('/top-headlines', {
      params: {
        category,
        country,
        pageSize: 20
      }
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching articles by category:', error);
    
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch news articles',
      error: error.response?.data || error.message
    });
  }
};

// Search articles by keyword
const searchArticles = async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'News API key is not configured on the server'
      });
    }

    const { q: query, sortBy = 'publishedAt' } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const response = await newsApiClient.get('/everything', {
      params: {
        q: query,
        sortBy,
        pageSize: 20,
        language: 'en'
      }
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error searching articles:', error);
    
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to search articles',
      error: error.response?.data || error.message
    });
  }
};

// Get top headlines
const getTopHeadlines = async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'News API key is not configured on the server'
      });
    }

    const { country = 'us' } = req.query;

    const response = await newsApiClient.get('/top-headlines', {
      params: {
        country,
        pageSize: 20
      }
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching top headlines:', error);
    
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch top headlines',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  getArticlesByCategory,
  searchArticles,
  getTopHeadlines
};
