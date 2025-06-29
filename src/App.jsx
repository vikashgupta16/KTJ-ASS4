import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import MySummaries from './components/MySummaries';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

// Services
import { newsAPI } from './services/newsAPI';
import { cacheService } from './services/cacheService';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [summaries, setSummaries] = useState([]);

  // Categories for navigation
  const categories = ['general', 'business', 'technology', 'sports', 'health'];

  // Fetch articles based on category or search query
  const fetchArticles = async (category = 'general', query = '') => {
    setLoading(true);
    setError('');
    
    try {
      // Check cache first
      const cacheKey = query ? `search_${query}` : `category_${category}`;
      const cachedData = cacheService.get(cacheKey);
      
      if (cachedData) {
        setArticles(cachedData);
        setLoading(false);
        return;
      }

      // Fetch from API
      const data = query 
        ? await newsAPI.searchArticles(query)
        : await newsAPI.getArticlesByCategory(category);
      
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        // Cache the results
        cacheService.set(cacheKey, data.articles);
      } else {
        setArticles([]);
        setError('No articles found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    fetchArticles(category);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory('');
    fetchArticles('', query);
  };

  // Handle article selection
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  // Add summary to saved summaries
  const addSummary = (article, summary) => {
    const newSummary = {
      id: Date.now(),
      article: article,
      summary: summary,
      createdAt: new Date().toISOString()
    };
    setSummaries(prev => [...prev, newSummary]);
    
    // Save to localStorage
    localStorage.setItem('savedSummaries', JSON.stringify([...summaries, newSummary]));
  };

  // Load saved summaries on component mount
  useEffect(() => {
    const savedSummaries = localStorage.getItem('savedSummaries');
    if (savedSummaries) {
      setSummaries(JSON.parse(savedSummaries));
    }
    
    // Fetch initial articles
    fetchArticles();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header onSearch={handleSearch} searchQuery={searchQuery} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <CategoryTabs 
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
                
                {loading && <LoadingSpinner />}
                {error && <ErrorMessage message={error} />}
                
                {!loading && !error && (
                  <ArticleList 
                    articles={articles}
                    onArticleSelect={handleArticleSelect}
                  />
                )}
                
                {selectedArticle && (
                  <ArticleDetail 
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                    onSummaryGenerated={addSummary}
                  />
                )}
              </>
            } />
            
            <Route path="/my-summaries" element={
              <MySummaries summaries={summaries} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
