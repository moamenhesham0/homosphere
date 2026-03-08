import { useState } from 'react';

const SearchBar = ({}) => {
    const [searchQuery, setSearchQuery] = useState('');

    function handleSearchChange(e) {
        setSearchQuery(e.target.value);
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for properties, locations, or neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <button type="button" onClick={handleSearchChange} className="search-btn">
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
            </button>
        </div>
    );
};
