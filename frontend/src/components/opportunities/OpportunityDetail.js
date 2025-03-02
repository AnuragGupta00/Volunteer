import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Opportunities.css';

const OpportunityDetail = () => {
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [volunteers, setVolunteers] = useState([]);
    const [hoveredVolunteer, setHoveredVolunteer] = useState(null);
    const [showAllVolunteers, setShowAllVolunteers] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/opportunities/${id}`);
                setOpportunity(res.data);
                setLoading(false);
                
                // If we have volunteers, fetch their details
                if (res.data.volunteers && res.data.volunteers.length > 0) {
                    fetchVolunteerDetails(res.data.volunteers);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

    const fetchVolunteerDetails = async (volunteerIds) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const config = {
                headers: {
                    'x-auth-token': token
                }
            };

            // Fetch all users
            const res = await axios.get(`http://localhost:3001/api/auth/users`, config);
            
            // Filter for only the volunteers for this opportunity
            const opportunityVolunteers = res.data.filter(user => 
                volunteerIds.includes(user._id)
            );
            
            setVolunteers(opportunityVolunteers);
        } catch (err) {
            console.error("Error fetching volunteer details:", err);
        }
    };

    const handleSignup = async () => {
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

            await axios.post(`http://localhost:3001/api/opportunities/${id}/signup`, {}, config);
            // Refresh opportunity data after signup
            const res = await axios.get(`http://localhost:3001/api/opportunities/${id}`);
            setOpportunity(res.data);
            
            // Refresh volunteer details
            if (res.data.volunteers && res.data.volunteers.length > 0) {
                fetchVolunteerDetails(res.data.volunteers);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Format date to a more readable format
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    // Format join date
    const formatJoinDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    };

    // Toggle showing all volunteers
    const toggleAllVolunteers = () => {
        setShowAllVolunteers(!showAllVolunteers);
    };

    // Render volunteer popup
    const renderVolunteerPopup = (volunteer) => {
        if (!hoveredVolunteer || hoveredVolunteer._id !== volunteer._id) return null;
        
        return (
            <div className="volunteer-popup">
                <div className="popup-header">
                    <div className="popup-avatar">{getInitials(volunteer.name)}</div>
                    <h4>{volunteer.name}</h4>
                </div>
                
                {volunteer.email && (
                    <div className="popup-detail">
                        <strong>Email:</strong> {volunteer.email}
                    </div>
                )}
                
                {volunteer.skills && volunteer.skills.length > 0 && (
                    <div className="popup-detail">
                        <strong>Skills:</strong> {volunteer.skills.join(', ')}
                    </div>
                )}
                
                {volunteer.interests && volunteer.interests.length > 0 && (
                    <div className="popup-detail">
                        <strong>Interests:</strong> {volunteer.interests.join(', ')}
                    </div>
                )}
                
                <div className="popup-detail">
                    <strong>Joined:</strong> {formatJoinDate(volunteer.date)}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <h3>Loading opportunity details...</h3>
                </div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="page-container">
                <div className="loading" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <h3>Opportunity not found</h3>
                    <p>The opportunity you're looking for may have been removed or doesn't exist.</p>
                    <Link to="/opportunities" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                        Browse Opportunities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="opportunity-detail-container">
                <div className="page-header">
                    <h1>{opportunity.title}</h1>
                    <p>{opportunity.description?.substring(0, 150)}{opportunity.description?.length > 150 ? '...' : ''}</p>
                </div>
                
                <div className="opportunity-detail-card">
                    <div className="opportunity-detail-content">
                        <div className="opportunity-meta-details">
                            <div className="meta-item">
                                <span className="meta-label">Organization</span>
                                <span className="meta-value">
                                    {opportunity.organization && typeof opportunity.organization === 'object' 
                                        ? opportunity.organization.name 
                                        : 'Unknown'}
                                </span>
                            </div>
                            
                            <div className="meta-item">
                                <span className="meta-label">Location</span>
                                <span className="meta-value">{opportunity.location || 'Not specified'}</span>
                            </div>
                            
                            <div className="meta-item">
                                <span className="meta-label">Date</span>
                                <span className="meta-value">{formatDate(opportunity.date)}</span>
                            </div>
                            
                            <div className="meta-item">
                                <span className="meta-label">Cause</span>
                                <span className="meta-value">{opportunity.cause || 'Not specified'}</span>
                            </div>
                        </div>
                        
                        <div className="opportunity-description">
                            <h3>About This Opportunity</h3>
                            <p>{opportunity.description || 'No description provided.'}</p>
                        </div>
                        
                        <div className="opportunity-skills-required">
                            <h3>Skills Required</h3>
                            <div className="skills-tags">
                                {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 ? (
                                    opportunity.skillsRequired.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))
                                ) : (
                                    <p>No specific skills required</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="volunteer-list">
                            <h3>Volunteer Status</h3>
                            <p>{opportunity.volunteers.length} {opportunity.volunteers.length === 1 ? 'person has' : 'people have'} signed up for this opportunity</p>
                            
                            {showAllVolunteers && volunteers.length > 0 ? (
                                <div className="all-volunteers-container">
                                    <div className="all-volunteers-grid">
                                        {volunteers.map((volunteer) => (
                                            <div 
                                                key={volunteer._id} 
                                                className="volunteer-item"
                                                onMouseEnter={() => setHoveredVolunteer(volunteer)}
                                                onMouseLeave={() => setHoveredVolunteer(null)}
                                            >
                                                <div className="volunteer-avatar expanded">
                                                    {getInitials(volunteer.name)}
                                                </div>
                                                <span className="volunteer-name">{volunteer.name}</span>
                                                {renderVolunteerPopup(volunteer)}
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        className="btn btn-secondary view-less-btn" 
                                        onClick={toggleAllVolunteers}
                                    >
                                        View Less
                                    </button>
                                </div>
                            ) : (
                                <div className="volunteers">
                                    {volunteers.slice(0, 5).map((volunteer) => (
                                        <div 
                                            key={volunteer._id} 
                                            className="volunteer-avatar"
                                            onMouseEnter={() => setHoveredVolunteer(volunteer)}
                                            onMouseLeave={() => setHoveredVolunteer(null)}
                                        >
                                            {getInitials(volunteer.name)}
                                            {renderVolunteerPopup(volunteer)}
                                        </div>
                                    ))}
                                    
                                    {opportunity.volunteers.length > 5 && (
                                        <div 
                                            className="volunteer-count"
                                            onClick={toggleAllVolunteers}
                                            title="View all volunteers"
                                        >
                                            +{opportunity.volunteers.length - 5}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="opportunity-actions">
                            <button 
                                onClick={() => navigate('/opportunities')}
                                className="btn btn-secondary"
                            >
                                Back to Opportunities
                            </button>
                            
                            <button 
                                onClick={handleSignup} 
                                className="btn btn-primary"
                                disabled={opportunity.volunteers.includes(localStorage.getItem('userId'))}
                            >
                                {opportunity.volunteers.includes(localStorage.getItem('userId')) 
                                    ? 'Already Signed Up' 
                                    : 'Sign Up to Volunteer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetail; 