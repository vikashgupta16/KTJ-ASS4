import axios from 'axios';
import { backendAPI } from './backendAPI';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API !== 'false'; // Default to true

const generateSummaryViaBackend = async (articleContent, title, url) => {
  try {
    const response = await backendAPI.summarizer.generateSummary({
      articleContent,
      title: title || 'Article',
      url
    });
    
    return response.data.data.summary;
  } catch (error) {
    console.error('Backend summary generation failed:', error);
    throw error;
  }
};

const generateSummaryDirectly = async (articleContent) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is required. Please add VITE_GEMINI_API_KEY to your .env.local file.');
  }

  const prompt = `Summarize the following news article in exactly 3 clear and concise bullet points. Focus on the main facts and key information:

${articleContent}

Please format your response as:
• [First key point]
• [Second key point]
• [Third key point]`;
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

  if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return response.data.candidates[0].content.parts[0].text.trim();
  } else {
    throw new Error('Invalid response format from Gemini API');
  }
};

export const geminiAPI = {
  summarizeArticle: async (articleContent, options = {}) => {
    try {
      const { title, url, preferBackend = USE_BACKEND_API } = options;

      // Try backend first if enabled and available
      if (preferBackend && backendAPI.isAuthenticated()) {
        try {
          return await generateSummaryViaBackend(articleContent, title, url);
        } catch (backendError) {
          console.warn('Backend summary failed, falling back to direct API call:', backendError.message);
          // Fall through to direct API call
        }
      }

      // Direct API call (original method)
      return await generateSummaryDirectly(articleContent);    } catch (error) {
      console.error('Error generating summary:', error);
      
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      } else {
        throw new Error(error.message || 'Failed to generate summary');
      }
    }
  },

  // Save article with summary to backend
  saveArticleWithSummary: async (article, summary, options = {}) => {
    try {
      if (!backendAPI.isAuthenticated()) {
        throw new Error('Authentication required to save articles');
      }

      const { tags = [], notes = '', category = 'general' } = options;

      const response = await backendAPI.summarizer.saveArticleWithSummary({
        article,
        summary,
        tags,
        notes,
        category
      });

      return response.data.data.savedArticle;
    } catch (error) {
      console.error('Error saving article with summary:', error);
      throw new Error(error.response?.data?.message || 'Failed to save article');
    }
  }
};
