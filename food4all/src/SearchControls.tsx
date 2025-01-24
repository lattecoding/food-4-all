import React, { useState } from "react";

interface SearchControlsProps {
  onSearch: (foodType: string, zipCode: string, radius: string) => void;
  isLoading: boolean;
}

const SearchControls: React.FC<SearchControlsProps> = ({ onSearch, isLoading }) => {
  const [foodType, setFoodType] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("");

  const handleSearch = () => {
    if (!foodType || !zipCode || !radius) {
      alert("Please fill in all fields.");
      return;
    }
    onSearch(foodType, zipCode, radius);
  };

  return (
    <div id="controls">
      <input
        type="text"
        placeholder="Enter food type (e.g., pizza)"
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter zip code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
      <input
        type="number"
        placeholder="Radius (miles)"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};

export default SearchControls;
