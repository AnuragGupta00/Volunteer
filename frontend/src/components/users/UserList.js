import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Users.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
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

                const res = await axios.get('http://localhost:3001/api/auth/users', config);
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    if (loading) {
        return (
            <div className="users-container">
                <h2>Loading users...</h2>
            </div>
        );
    }

    return (
        <div className="users-container">
            <h2>Volunteer Community</h2>
            <div className="users-grid">
                {users.map(user => (
                    <div key={user._id} className="user-card">
                        <h3>{user.name}</h3>
                        <div className="user-email">{user.email}</div>
                        
                        <div className="skills-section">
                            <div className="section-title">Skills</div>
                            <div className="tag-list">
                                {user.skills.map((skill, index) => (
                                    <span key={index} className="tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="interests-section">
                            <div className="section-title">Interests</div>
                            <div className="tag-list">
                                {user.interests.map((interest, index) => (
                                    <span key={index} className="tag">{interest}</span>
                                ))}
                            </div>
                        </div>

                        <div className="join-date">
                            Joined {new Date(user.date).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList; 