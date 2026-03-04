import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        console.log('Button clicked!');
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.icon}>👋</div>
                <h1 style={styles.heading}>You've been logged out</h1>
                <p style={styles.subtext}>Thanks for visiting! Ready to explore more restaurants?</p>
                <button onClick={handleClick} style={styles.button}>
                    Back to Search
                </button>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #faf7f2 0%, #f0ebe3 100%)',
        padding: '20px',
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
    },
    icon: {
        fontSize: '3rem',
        marginBottom: '12px',
    },
    heading: {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.6rem',
        color: '#2d3436',
        marginBottom: '10px',
    },
    subtext: {
        fontSize: '0.95rem',
        color: '#636e72',
        marginBottom: '28px',
        lineHeight: '1.5',
    },
    button: {
        padding: '13px 32px',
        fontSize: '0.95rem',
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(135deg, #e17055, #d35400)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        letterSpacing: '0.03em',
    },
};

export default LogoutPage;
