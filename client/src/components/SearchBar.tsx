import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query); // Pass the search query back to the parent component
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update the query as the user types
        placeholder="Search for cooking videos"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;