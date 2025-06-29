import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// Create axios instance with default config
const newsApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'X-API-Key': NEWS_API_KEY
  }
});

export const newsAPI = {  // Get articles by category
  getArticlesByCategory: async (category = 'general', country = 'us') => {
    try {
      if (!NEWS_API_KEY) {
        throw new Error('News API key is required. Please add VITE_NEWS_API_KEY to your .env.local file.');
      }

      const response = await newsApiClient.get('/top-headlines', {
        params: {
          category,
          country,
          pageSize: 20
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch news articles'
      );
    }
  },
  // Search articles by keyword
  searchArticles: async (query, sortBy = 'publishedAt') => {
    try {
      if (!NEWS_API_KEY) {
        throw new Error('News API key is required. Please add VITE_NEWS_API_KEY to your .env.local file.');
      }

      const response = await newsApiClient.get('/everything', {
        params: {
          q: query,
          sortBy,
          pageSize: 20,
          language: 'en'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching articles:', error);
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to search articles'
      );
    }
  },
  // Get top headlines
  getTopHeadlines: async (country = 'us') => {
    try {
      if (!NEWS_API_KEY) {
        throw new Error('News API key is required. Please add VITE_NEWS_API_KEY to your .env.local file.');
      }

      const response = await newsApiClient.get('/top-headlines', {
        params: {
          country,
          pageSize: 20
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch top headlines'
      );
    }
  }
};
