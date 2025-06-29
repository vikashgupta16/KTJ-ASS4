const axios = require('axios');
const SavedArticle = require('../models/savedArticle.model');
const { extractFullArticleContent, getArticleContentWithFallback } = require('../services/articleExtractor');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Generate summary using Gemini AI
const generateSummary = async (req, res) => {
  try {
    const { articleContent, title, url } = req.body;

    if (!articleContent || !title) {
      return res.status(400).json({
        success: false,
        message: 'Article content and title are required'
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is not configured on the server'
      });
    }

    const prompt = `Summarize the following news article in exactly 3 clear and concise bullet points. Focus on the main facts and key information:

Title: ${title}

Content: ${articleContent}

Please format your response as:
• [First key point]
• [Second key point]
• [Third key point]

Keep each bullet point under 50 words and focus on the most important information.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const summary = response.data.candidates[0].content.parts[0].text.trim();

    res.json({
      success: true,
      data: {
        summary,
        generatedAt: new Date(),
        model: 'gemini-1.5-flash',
        article: {
          title,
          url
        }
      }
    });

  } catch (error) {
    console.error('Generate summary error:', error);
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    if (error.response?.status === 403 || error.response?.status === 401) {
      return res.status(403).json({
        success: false,
        message: 'Invalid API key or access forbidden.'
      });
    }
    
    if (error.response?.data?.error?.message) {
      return res.status(400).json({
        success: false,
        message: error.response.data.error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate summary. Please try again.'
    });
  }
};

// Save article with summary
const saveArticleWithSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      article, 
      summary, 
      tags = [], 
      notes = '',
      category = 'general'
    } = req.body;

    // Validate required fields
    if (!article || !article.title || !article.url || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Article details and summary are required'
      });
    }

    // Check if article already saved by this user
    const existingArticle = await SavedArticle.findOne({
      user: userId,
      'article.url': article.url
    });

    if (existingArticle) {
      // Update existing article with new summary
      existingArticle.summary = {
        content: summary,
        generatedAt: new Date(),
        model: 'gemini-pro'
      };
      existingArticle.tags = [...new Set([...existingArticle.tags, ...tags])];
      if (notes) existingArticle.notes = notes;
      
      await existingArticle.save();

      return res.json({
        success: true,
        message: 'Article summary updated successfully',
        data: {
          savedArticle: existingArticle
        }
      });
    }

    // Create new saved article
    const savedArticle = new SavedArticle({
      user: userId,
      article: {
        ...article,
        category: category || 'general'
      },
      summary: {
        content: summary,
        generatedAt: new Date(),
        model: 'gemini-pro'
      },
      tags,
      notes
    });

    await savedArticle.save();

    res.status(201).json({
      success: true,
      message: 'Article saved with summary successfully',
      data: {
        savedArticle
      }
    });

  } catch (error) {
    console.error('Save article with summary error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Article already saved'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save article'
    });
  }
};

// Get saved article by ID
const getSavedArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    const savedArticle = await SavedArticle.findOne({
      _id: articleId,
      user: userId
    });

    if (!savedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: {
        savedArticle
      }
    });

  } catch (error) {
    console.error('Get saved article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article'
    });
  }
};

// Update saved article
const updateSavedArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;
    const { 
      tags, 
      notes, 
      isFavorite, 
      readingStatus, 
      readingTime 
    } = req.body;

    const updateData = {};
    if (tags !== undefined) updateData.tags = tags;
    if (notes !== undefined) updateData.notes = notes;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (readingStatus !== undefined) updateData.readingStatus = readingStatus;
    if (readingTime !== undefined) updateData.readingTime = readingTime;

    const savedArticle = await SavedArticle.findOneAndUpdate(
      { _id: articleId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!savedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: {
        savedArticle
      }
    });

  } catch (error) {
    console.error('Update saved article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update article'
    });
  }
};

// Delete saved article
const deleteSavedArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    const savedArticle = await SavedArticle.findOneAndDelete({
      _id: articleId,
      user: userId
    });

    if (!savedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Delete saved article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete article'
    });
  }
};

// Batch operations for articles
const batchUpdateArticles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { articleIds, operation, value } = req.body;

    if (!articleIds || !Array.isArray(articleIds) || !operation) {
      return res.status(400).json({
        success: false,
        message: 'Article IDs and operation are required'
      });
    }

    let updateData = {};
    
    switch (operation) {
      case 'favorite':
        updateData.isFavorite = value === true;
        break;
      case 'markAsRead':
        updateData.readingStatus = 'read';
        break;
      case 'markAsUnread':
        updateData.readingStatus = 'unread';
        break;
      case 'delete':
        const deletedCount = await SavedArticle.deleteMany({
          _id: { $in: articleIds },
          user: userId
        });
        return res.json({
          success: true,
          message: `${deletedCount.deletedCount} articles deleted successfully`
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation'
        });
    }

    const result = await SavedArticle.updateMany(
      { _id: { $in: articleIds }, user: userId },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} articles updated successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Batch update articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch operation failed'
    });
  }
};

// Extract full article content from URL
const extractArticleContent = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Article URL is required'
      });
    }

    // Extract full content using readability
    const extracted = await extractFullArticleContent(url);

    if (extracted.success) {
      res.json({
        success: true,
        data: {
          title: extracted.title,
          content: extracted.content,
          excerpt: extracted.excerpt,
          length: extracted.length,
          siteName: extracted.siteName,
          byline: extracted.byline,
          url: url,
          extractedAt: new Date()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Could not extract article content',
        error: extracted.error
      });
    }

  } catch (error) {
    console.error('Error in extractArticleContent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract article content',
      error: error.message
    });
  }
};

// Generate summary with full article content extraction
const generateSummaryWithFullContent = async (req, res) => {
  try {
    const { articleUrl, title } = req.body;

    if (!articleUrl) {
      return res.status(400).json({
        success: false,
        message: 'Article URL is required'
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is not configured on the server'
      });
    }

    // Extract full article content
    console.log('Extracting full content from:', articleUrl);
    const extracted = await extractFullArticleContent(articleUrl);
    
    let articleContent;
    let extractedTitle = title;

    if (extracted.success && extracted.content) {
      articleContent = extracted.content;
      extractedTitle = extracted.title || title;
      console.log(`Successfully extracted ${extracted.content.length} characters`);
    } else {
      console.log('Failed to extract content, using fallback');
      return res.status(400).json({
        success: false,
        message: 'Could not extract article content from URL',
        error: extracted.error
      });
    }

    const prompt = `Summarize the following news article in exactly 3 clear and concise bullet points. Focus on the main facts and key information:

Title: ${extractedTitle}

Content: ${articleContent}

Please format your response as:
• [First key point]
• [Second key point]
• [Third key point]

Keep each bullet point under 50 words and focus on the most important information.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const summary = response.data.candidates[0].content.parts[0].text.trim();

    res.json({
      success: true,
      data: {
        summary,
        generatedAt: new Date(),
        model: 'gemini-1.5-flash',
        article: {
          title: extractedTitle,
          url: articleUrl,
          contentLength: articleContent.length,
          extractedContent: extracted.success
        }
      }
    });

  } catch (error) {
    console.error('Error in generateSummaryWithFullContent:', error);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        message: 'Request timeout. The AI service took too long to respond.'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded. Please try again later.'
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request to AI service',
        details: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message
    });
  }
};

module.exports = {
  generateSummary,
  saveArticleWithSummary,
  getSavedArticle,
  updateSavedArticle,
  deleteSavedArticle,
  batchUpdateArticles,
  extractArticleContent,
  generateSummaryWithFullContent
};
