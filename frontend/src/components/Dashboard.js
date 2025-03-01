import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const res = await axios.get('http://localhost:3001/api/auth/user', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user:', err);
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        // Fetch volunteer opportunities
        const fetchOpportunities = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/opportunities');
                setOpportunities(res.data);
            } catch (err) {
                console.error('Error fetching opportunities:', err);
            }
        };

        fetchUser();
        fetchOpportunities();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Welcome, {user ? user.name : 'User'}!</h2>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>

            <h3>Available Volunteer Opportunities</h3>
            <ul style={styles.list}>
                {opportunities.length > 0 ? (
                    opportunities.map((opportunity) => (
                        <li key={opportunity._id} style={styles.card}>
                            <h4>{opportunity.title}</h4>
                            <p>{opportunity.description}</p>
                            <p><strong>Cause:</strong> {opportunity.cause}</p>
                            <button style={styles.applyButton}>Apply Now</button>
                        </li>
                    ))
                ) : (
                    <p>No opportunities available.</p>
                )}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    logoutButton: {
        background: 'red',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    card: {
        border: '1px solid #ddd',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '5px',
        background: '#f9f9f9',
    },
    applyButton: {
        background: 'blue',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
};

export default Dashboard;