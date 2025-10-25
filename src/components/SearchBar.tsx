import React, { useState, useEffect } from 'react';
import { useIssueStore } from '../store/issueStore';
import './SearchBar.css';

export const SearchBar: React.FC = () => {
  const setSearchQuery = useIssueStore(state => state.setSearchQuery);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  return (
    <div className="search-bar">
      <label htmlFor="search-input" className="sr-only">
        Search issues by title or tags
      </label>
      <input
        id="search-input"
        type="text"
        placeholder="Search by title or tags..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
        aria-describedby="search-hint"
      />
      <span id="search-hint" className="sr-only">
        Enter keywords to filter issues
      </span>

      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          className="clear-button"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};
