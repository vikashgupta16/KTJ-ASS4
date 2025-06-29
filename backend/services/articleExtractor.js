const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

/**
 * Extract full article content from a URL using Mozilla's Readability
 * @param {string} url - The article URL to extract content from
 * @returns {Promise<Object>} - The extracted article content
 */
const extractFullArticleContent = async (url) => {
  try {
    // Fetch the HTML content of the article
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Create a DOM object from the HTML
    const dom = new JSDOM(response.data, {
      url: url
    });

    // Parse the article using Readability
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Could not parse article content');
    }

    return {
      success: true,
      title: article.title,
      content: article.textContent,
      excerpt: article.excerpt,
      length: article.length,
      siteName: article.siteName,
      byline: article.byline
    };

  } catch (error) {
    console.error('Error extracting article content:', error.message);
    
    // Return error information
    return {
      success: false,
      error: error.message,
      content: null
    };
  }
};

/**
 * Get full article content with fallback to NewsAPI description
 * @param {Object} article - Article object from NewsAPI
 * @returns {Promise<string>} - Full article content or fallback
 */
const getArticleContentWithFallback = async (article) => {
  try {
    // First try to extract full content
    const extracted = await extractFullArticleContent(article.url);
    
    if (extracted.success && extracted.content) {
      // Use extracted content if successful and has substantial content
      if (extracted.content.length > (article.description?.length || 500)) {
        return extracted.content;
      }
    }
    
    // Fallback to NewsAPI description if extraction fails or content is too short
    return article.description || article.content || 'No content available';
    
  } catch (error) {
    console.error('Error getting article content:', error.message);
    // Fallback to NewsAPI data
    return article.description || article.content || 'No content available';
  }
};

module.exports = {
  extractFullArticleContent,
  getArticleContentWithFallback
};
