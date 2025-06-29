import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onSearch, searchQuery }) => {
  const [query, setQuery] = useState(searchQuery || '');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          📰 NewsAI
        </Link>
        
        <div className="nav-section">
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/my-summaries">My Summaries</Link></li>
            </ul>
          </nav>
          
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="search-container">
          <input
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
