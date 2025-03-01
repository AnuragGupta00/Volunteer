import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Users.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
        });
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="users-container">
                <div className="users-header">
                    <h2>Volunteer Community</h2>
                    <p>Connect with other volunteers and expand your network</p>
                </div>
                <div className="loading-container">
                    <div className="loading">Loading volunteers...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <h2>Volunteer Community</h2>
                <p>Connect with other volunteers and expand your network</p>
            </div>

            <div className="users-filter">
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Search by name, skills or interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUsers.length === 0 ? (
                <div className="empty-state">
                    <h3>No volunteers found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="users-grid">
                    {filteredUsers.map(user => (
                        <div key={user._id} className="user-card">
                            <div className="user-header">
                                <div className="user-avatar">
                                    {getInitials(user.name)}
                                </div>
                                <h3 className="user-name">{user.name}</h3>
                            </div>

                            <div className="user-content">
                                <div className="user-section">
                                    <div className="section-title">Skills</div>
                                    <div className="tag-list">
                                        {user.skills && user.skills.length > 0 ? (
                                            user.skills.map((skill, index) => (
                                                <span key={index} className="tag">{skill}</span>
                                            ))
                                        ) : (
                                            <span className="no-tags">No skills listed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="user-section">
                                    <div className="section-title">Interests</div>
                                    <div className="tag-list">
                                        {user.interests && user.interests.length > 0 ? (
                                            user.interests.map((interest, index) => (
                                                <span key={index} className="tag">{interest}</span>
                                            ))
                                        ) : (
                                            <span className="no-tags">No interests listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="join-date">
                                Joined {formatDate(user.date)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList; 