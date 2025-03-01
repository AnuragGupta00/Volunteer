import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Opportunities.css';

const OpportunityList = () => {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/opportunities');
                setOpportunities(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOpportunities();
    }, []);

    return (
        <div className="opportunities-container">
            <h2>Volunteer Opportunities</h2>
            <div className="opportunities-grid">
                {opportunities.map(opportunity => (
                    <div key={opportunity._id} className="opportunity-card">
                        <h3>{opportunity.title}</h3>
                        <p>{opportunity.description.substring(0, 150)}...</p>
                        <div className="opportunity-details">
                            <p><strong>Location:</strong> {opportunity.location}</p>
                            <p><strong>Date:</strong> {new Date(opportunity.date).toLocaleDateString()}</p>
                            <p><strong>Skills Required:</strong> {opportunity.skillsRequired.join(', ')}</p>
                            <p><strong>Cause:</strong> {opportunity.cause}</p>
                        </div>
                        <Link to={`/opportunities/${opportunity._id}`} className="btn btn-primary">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OpportunityList; 