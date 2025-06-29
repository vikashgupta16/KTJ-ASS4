import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/news`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const newsAPI = {
  // Get articles by category
  getArticlesByCategory: async (category = 'general', country = 'us') => {
    try {
      const response = await apiClient.get('/category', {
        params: {
          category,
          country
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch news articles');
      }
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
      const response = await apiClient.get('/search', {
        params: {
          q: query,
          sortBy
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to search articles');
      }
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
      const response = await apiClient.get('/headlines', {
        params: {
          country
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch top headlines');
      }
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
