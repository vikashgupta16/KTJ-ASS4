

const MySummaries = ({ summaries }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateTitle = (title, maxLength = 80) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  if (!summaries || summaries.length === 0) {
    return (
      <div className="summaries-container">
        <div className="summaries-header">
          <h1>My Summaries</h1>
          <p>Your saved article summaries will appear here</p>
        </div>
        
        <div className="empty-state">
          <h2>No summaries yet</h2>
          <p>Start by reading articles and generating summaries to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="summaries-container">
      <div className="summaries-header">
        <h1>My Summaries</h1>
        <p>You have {summaries.length} saved summaries</p>
      </div>
      
      <div className="summaries-list">
        {summaries.map((summary) => (
          <div key={summary.id} className="summary-card">
            <h3 className="summary-card-title">
              {truncateTitle(summary.article.title)}
            </h3>
            
            <div className="summary-card-meta">
              <span>Source: {summary.article.source?.name || 'Unknown'}</span>
              <span> • </span>
              <span>Saved: {formatDate(summary.createdAt)}</span>
            </div>
            
            <div className="summary-card-content">
              <div dangerouslySetInnerHTML={{ __html: summary.summary.replace(/\n/g, '<br>') }} />
            </div>
            
            <div className="article-actions">
              <a
                href={summary.article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button primary-button"
              >
                Read Original Article
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySummaries;
