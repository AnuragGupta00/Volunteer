import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#2c3e50',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        logo: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
        },
        navLinks: {
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
        },
        link: {
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.3s',
        },
        button: {
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s',
        }
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.logo}>
                Volunteer Platform
            </Link>
            <div style={styles.navLinks}>
                {!token ? (
                    <>
                        <Link 
                            to="/" 
                            style={styles.link}
                            onMouseOver={e => e.target.style.backgroundColor = '#34495e'}
                            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/signup" 
                            style={styles.link}
                            onMouseOver={e => e.target.style.backgroundColor = '#34495e'}
                            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                        >
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/dashboard" 
                            style={styles.link}
                            onMouseOver={e => e.target.style.backgroundColor = '#34495e'}
                            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
                        >
                            Dashboard
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            style={styles.button}
                            onMouseOver={e => e.target.style.backgroundColor = '#c0392b'}
                            onMouseOut={e => e.target.style.backgroundColor = '#e74c3c'}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar; 