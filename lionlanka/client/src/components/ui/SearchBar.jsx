import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ variant = 'default', placeholder = 'Search articles...', onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  // Initialize query from URL if on search page
  useEffect(() => {
    if (location.pathname === '/search') {
      const searchParams = new URLSearchParams(location.search);
      const q = searchParams.get('q');
      if (q) setQuery(q);
    }
  }, [location]);

  // Debounced callback for live search (if provided)
  const debouncedSearch = useRef(
    debounce((val) => {
      if (onSearch) onSearch(val);
    }, 400)
  ).current;

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isHero = variant === 'hero';

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${isHero ? 'max-w-2xl mx-auto' : 'w-full'}`}
    >
      <div className={`relative flex items-center w-full rounded-xl overflow-hidden border transition-all duration-300 ${
        isHero 
          ? 'bg-white/5 border-white/20 hover:border-primary/50 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-md' 
          : 'bg-surface border-white/10 focus-within:border-primary'
      }`}>
        
        <div className={`absolute left-0 flex items-center justify-center text-muted pl-4 ${isHero ? 'pl-6' : ''}`}>
          <Search size={isHero ? 24 : 18} className="text-muted group-focus-within:text-primary transition-colors" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full bg-transparent text-text-main placeholder-muted outline-none ${
            isHero ? 'py-4 pl-14 pr-12 text-lg font-medium' : 'py-2.5 pl-11 pr-10 text-sm'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-0 flex items-center justify-center text-muted hover:text-white transition-colors pr-4 ${isHero ? 'pr-6' : ''}`}
          >
            <X size={isHero ? 20 : 16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
