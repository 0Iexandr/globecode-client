import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.length >= 3) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && query.length >= 3) {
      handleSearch();
    }
  };

  return (
    <section
      className="section__padding container flex flex-col items-center"
      id="search"
    >
      <h2 className="section__title mb-12">Search on Nice Advice</h2>
      <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md w-full max-w-4xl">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search articles..."
          className="section__description w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-main focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleSearch}
          disabled={query.length < 3}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
            query.length >= 3
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
