import { useState } from 'react';
import { geminiAPI } from '../services/geminiAPI';
import { backendAPI } from '../services/backendAPI';

const ArticleDetail = ({ article, onClose, onSummaryGenerated }) => {
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [extractingContent, setExtractingContent] = useState(false);
  const [extractionError, setExtractionError] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleSummarize = async () => {
    setSummarizing(true);
    setSummaryError('');
    
    try {
      // Use the new full content extraction endpoint
      const response = await backendAPI.summarizer.generateSummaryWithFullContent({
        articleUrl: article.url,
        title: article.title
      });
      
      if (response.data.success) {
        setSummary(response.data.data.summary);
        onSummaryGenerated(article, response.data.data.summary);
      } else {
        throw new Error(response.data.message || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      
      // Fallback to old method if the new one fails
      try {
        const articleContent = `${article.title}\n\n${article.description || ''}\n\n${article.content || ''}`;
        const generatedSummary = await geminiAPI.summarizeArticle(articleContent, {
          title: article.title,
          url: article.url,
          preferBackend: true
        });
        
        setSummary(generatedSummary);
        onSummaryGenerated(article, generatedSummary);
      } catch (fallbackError) {
        setSummaryError(fallbackError.message || 'Failed to generate summary');
      }
    } finally {
      setSummarizing(false);
    }
  };

  const handleExtractFullContent = async () => {
    setExtractingContent(true);
    setExtractionError('');
    
    try {
      const response = await backendAPI.summarizer.extractArticleContent({
        url: article.url
      });
      
      if (response.data.success) {
        setFullContent(response.data.data.content);
      } else {
        throw new Error(response.data.message || 'Failed to extract full content');
      }
    } catch (error) {
      console.error('Content extraction error:', error);
      setExtractionError(error.response?.data?.message || error.message || 'Failed to extract full content');
    } finally {
      setExtractingContent(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="article-detail-overlay" onClick={handleOverlayClick}>
      <div className="article-detail">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="article-detail-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        
        <div className="article-detail-content">
          <h1 className="article-detail-title">{article.title}</h1>
          
          <div className="article-detail-meta">
            <div>
              <strong>Source:</strong> {article.source?.name || 'Unknown'}
            </div>
            {article.author && (
              <div>
                <strong>Author:</strong> {article.author}
              </div>
            )}
            <div>
              <strong>Published:</strong> {formatDate(article.publishedAt)}
            </div>
          </div>
          
          <p className="article-detail-description">
            {article.description}
          </p>
          
          {(article.content || fullContent) && (
            <div className="article-content-full">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Article Content
              </h3>
              <p>{fullContent || article.content}</p>
            </div>
          )}

          {extractionError && (
            <div className="error-message">
              {extractionError}
            </div>
          )}
          
          <div className="article-actions">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button primary-button"
            >
              Read Full Article
            </a>

            {!fullContent && (
              <button
                onClick={handleExtractFullContent}
                disabled={extractingContent}
                className="action-button primary-button"
              >
                {extractingContent ? 'Extracting...' : 'Extract Full Content'}
              </button>
            )}
            
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="action-button secondary-button"
            >
              {summarizing ? 'Summarizing...' : 'AI Summarize'}
            </button>
          </div>
          
          {summaryError && (
            <div className="error-message">
              {summaryError}
            </div>
          )}
          
          {(summary || summarizing) && (
            <div className="summary-section">
              <h3 className="summary-title">AI Summary</h3>
              <div className="summary-content">
                {summarizing ? (
                  <div className="summary-loading">
                    Generating summary using AI...
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br>') }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
