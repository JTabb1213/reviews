import React, { useState } from 'react';

interface Search {
    onSearch: (searchTerm: string) => void;
}

const SearchBarForSearchPage: React.FC<Search> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div style={styles.container}>
            <input
                type="text"
                placeholder="Search for a restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>
                Search
            </button>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        gap: '10px',
    },
    input: {
        padding: '12px 16px',
        fontSize: '0.95rem',
        fontFamily: "'Inter', sans-serif",
        color: '#2d3436',
        border: '2px solid #dfe6e9',
        borderRadius: '8px',
        outline: 'none',
        background: '#faf7f2',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        minWidth: '240px',
    },
    button: {
        padding: '12px 24px',
        fontSize: '0.95rem',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        background: 'linear-gradient(135deg, #e17055, #d35400)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        letterSpacing: '0.03em',
    },
};

export default SearchBarForSearchPage;
