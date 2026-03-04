import React, { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchButton.css';

function SearchButton() {
    const navigate = useNavigate();
    const handleSearch = (event: MouseEvent) => {
        event.preventDefault();
        navigate('/');
    }

    return (
        <button onClick={handleSearch} className="Search-button">
            ← Back to Search
        </button>
    );
}

export default SearchButton;