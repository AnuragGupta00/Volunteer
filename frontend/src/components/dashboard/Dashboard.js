import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: {
                        'x-auth-token': token
                    }
                };

                // Fetch user data
                const userRes = await axios.get('http://localhost:3001/api/auth/me', config);
                setUserData(userRes.data);

                // Fetch opportunities
                const opportunitiesRes = await axios.get('http://localhost:3001/api/opportunities', config);
                setOpportunities(opportunitiesRes.data);
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading || !userData) {
        return (
            <div className="dashboard-container">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    const signedUpOpportunities = opportunities.filter(
        opp => opp.volunteers.includes(userData._id)
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome, {userData.name}!</h2>
                <div className="user-profile">
                    <div className="profile-info">
                        <h3>Your Profile</h3>
                        <p>{userData.email}</p>
                        <div className="tag-container">
                            {userData.skills.map((skill, index) => (
                                <span key={`skill-${index}`} className="profile-tag">{skill}</span>
                            ))}
                        </div>
                        <h3 style={{ marginTop: '20px' }}>Interests</h3>
                        <div className="tag-container">
                            {userData.interests.map((interest, index) => (
                                <span key={`interest-${index}`} className="profile-tag">{interest}</span>
                            ))}
                        </div>
                    </div>
                    <div className="profile-stats">
                        <div className="stat-card">
                            <div className="stat-number">{signedUpOpportunities.length}</div>
                            <div className="stat-label">Opportunities Joined</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{userData.skills.length}</div>
                            <div className="stat-label">Skills</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{userData.interests.length}</div>
                            <div className="stat-label">Interests</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="dashboard-section">
                    <h3>Your Volunteer Activities</h3>
                    <div className="activity-list">
                        {signedUpOpportunities.length > 0 ? (
                            signedUpOpportunities.map(opp => (
                                <Link 
                                    to={`/opportunities/${opp._id}`} 
                                    key={opp._id}
                                    className="activity-item"
                                >
                                    <div className="activity-title">{opp.title}</div>
                                    <div className="activity-date">
                                        Date: {new Date(opp.date).toLocaleDateString()}
                                    </div>
                                    <div>Location: {opp.location}</div>
                                </Link>
                            ))
                        ) : (
                            <p>You haven't signed up for any opportunities yet.</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h3>Recommended Opportunities</h3>
                    <div className="activity-list">
                        {opportunities
                            .filter(opp => 
                                !opp.volunteers.includes(userData._id) &&
                                opp.skillsRequired.some(skill => 
                                    userData.skills.includes(skill)
                                )
                            )
                            .slice(0, 3)
                            .map(opp => (
                                <Link 
                                    to={`/opportunities/${opp._id}`} 
                                    key={opp._id}
                                    className="activity-item"
                                >
                                    <div className="activity-title">{opp.title}</div>
                                    <div className="activity-date">
                                        Date: {new Date(opp.date).toLocaleDateString()}
                                    </div>
                                    <div>Location: {opp.location}</div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 