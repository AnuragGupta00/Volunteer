import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Opportunities.css';

const OpportunityDetail = () => {
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/opportunities/${id}`);
                setOpportunity(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

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
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!opportunity) {
        return <div>Opportunity not found</div>;
    }

    return (
        <div className="opportunity-detail-container">
            <h2>{opportunity.title}</h2>
            <div className="opportunity-info">
                <p className="description">{opportunity.description}</p>
                <div className="details">
                    <p><strong>Organization:</strong> {opportunity.organization}</p>
                    <p><strong>Location:</strong> {opportunity.location}</p>
                    <p><strong>Date:</strong> {new Date(opportunity.date).toLocaleDateString()}</p>
                    <p><strong>Skills Required:</strong> {opportunity.skillsRequired.join(', ')}</p>
                    <p><strong>Cause:</strong> {opportunity.cause}</p>
                    <p><strong>Number of Volunteers:</strong> {opportunity.volunteers.length}</p>
                </div>
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
    );
};

export default OpportunityDetail; 