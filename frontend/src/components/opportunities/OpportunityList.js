import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Opportunities.css';

const OpportunityList = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:3001/api/opportunities');
                setOpportunities(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    // Format date to a readable format
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="opportunities-container">
            <h2>Volunteer Opportunities</h2>
            
            {loading ? (
                <div className="loading" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    Loading opportunities...
                </div>
            ) : opportunities.length === 0 ? (
                <div className="no-opportunities" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <p>No opportunities found. Check back later!</p>
                </div>
            ) : (
                <div className="opportunities-grid">
                    {opportunities.map(opportunity => (
                        <div key={opportunity._id} className="opportunity-card">
                            <h3>{opportunity.title}</h3>
                            <p>{opportunity.description?.substring(0, 100) || 'No description available'}...</p>
                            
                            <div className="opportunity-details">
                                <p>
                                    <strong>Location:</strong> 
                                    <span>{opportunity.location || 'Not specified'}</span>
                                </p>
                                <p>
                                    <strong>Date:</strong> 
                                    <span>{formatDate(opportunity.date)}</span>
                                </p>
                                <p>
                                    <strong>Skills Required:</strong> 
                                    <span>{opportunity.skillsRequired?.join(', ') || 'None specified'}</span>
                                </p>
                                <p>
                                    <strong>Cause:</strong> 
                                    <span>{opportunity.cause || 'Not specified'}</span>
                                </p>
                            </div>
                            
                            <Link to={`/opportunities/${opportunity._id}`} className="btn btn-primary">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OpportunityList; 