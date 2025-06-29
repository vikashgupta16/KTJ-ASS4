

const ArticleList = ({ articles, onArticleSelect }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="empty-state">
        <h2>No articles found</h2>
        <p>Try searching for different keywords or selecting another category.</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      {articles.map((article, index) => (
        <div
          key={`${article.url}-${index}`}
          className="article-card"
          onClick={() => onArticleSelect(article)}
        >
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="article-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          <div className="article-content">
            <h3 className="article-title">
              {truncateText(article.title, 100)}
            </h3>
            
            <p className="article-description">
              {truncateText(article.description, 120)}
            </p>
            
            <div className="article-meta">
              <span className="article-source">
                {article.source?.name || 'Unknown Source'}
              </span>
              <span className="article-date">
                {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
