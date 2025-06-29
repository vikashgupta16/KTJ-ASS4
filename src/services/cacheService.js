// Cache service for storing articles in sessionStorage to avoid redundant API calls
export const cacheService = {
  // Get cached data
  get: (key) => {
    try {
      const cached = sessionStorage.getItem(`newsapp_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid (30 minutes)
        if (now - data.timestamp < 30 * 60 * 1000) {
          return data.value;
        } else {
          // Remove expired cache
          sessionStorage.removeItem(`newsapp_${key}`);
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  // Set cached data
  set: (key, value) => {
    try {
      const data = {
        value,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`newsapp_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  },

  // Clear specific cache
  remove: (key) => {
    try {
      sessionStorage.removeItem(`newsapp_${key}`);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  },

  // Clear all cache
  clear: () => {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('newsapp_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};
