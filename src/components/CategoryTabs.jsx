

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="category-tabs">
      <div className="tabs-container">
        {categories.map(category => (
          <button
            key={category}
            className={`tab-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
