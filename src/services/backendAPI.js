import axios from 'axios';

// Use environment variable or default based on current environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://ktj-ass-4-alpha-coders-projects-fae97fae.vercel.app/api'
    : 'http://localhost:5001/api');

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

export const backendAPI = {
  // Authentication endpoints
  auth: {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    changePassword: (data) => apiClient.put('/auth/change-password', data),
    logout: () => apiClient.post('/auth/logout')
  },

  // User endpoints
  user: {
    getStats: () => apiClient.get('/user/stats'),
    getSavedArticles: (params = {}) => apiClient.get('/user/articles', { params }),
    searchArticles: (params) => apiClient.get('/user/articles/search', { params }),
    getPreferences: () => apiClient.get('/user/preferences'),
    updatePreferences: (data) => apiClient.put('/user/preferences', data),
    deleteAccount: (password) => apiClient.delete('/user/account', { data: { password } })
  },

  // Summarizer endpoints
  summarizer: {
    generateSummary: (data) => apiClient.post('/summarizer/generate', data),
    extractArticleContent: (data) => apiClient.post('/summarizer/extract', data),
    generateSummaryWithFullContent: (data) => apiClient.post('/summarizer/generate-full', data),
    saveArticleWithSummary: (data) => apiClient.post('/summarizer/save', data),
    getSavedArticle: (articleId) => apiClient.get(`/summarizer/article/${articleId}`),
    updateSavedArticle: (articleId, data) => apiClient.put(`/summarizer/article/${articleId}`, data),
    deleteSavedArticle: (articleId) => apiClient.delete(`/summarizer/article/${articleId}`),
    batchUpdateArticles: (data) => apiClient.put('/summarizer/articles/batch', data)
  },

  // Utility methods
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.Authorization;
    }
  },

  getAuthToken: () => localStorage.getItem('authToken'),

  isAuthenticated: () => !!localStorage.getItem('authToken'),

  // Health check
  healthCheck: () => apiClient.get('/health').catch(() => 
    // If backend health check fails, try the base URL
    axios.get(API_BASE_URL.replace('/api', '/health'))
  )
};
