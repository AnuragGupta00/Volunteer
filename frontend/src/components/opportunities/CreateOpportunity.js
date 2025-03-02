import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Opportunities.css';

const CreateOpportunity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        cause: '',
        location: '',
        date: ''
    });

    const { title, description, skillsRequired, cause, location, date } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            const body = JSON.stringify({
                title,
                description,
                skillsRequired: skillsRequired.split(',').map(skill => skill.trim()),
                cause,
                location,
                date
            });

            await axios.post('http://localhost:3001/api/opportunities', body, config);
            navigate('/opportunities');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="page-container">
            <div className="create-opportunity-container">
                <div className="page-header">
                    <h1>Create New Volunteer Opportunity</h1>
                    <p>Fill out the form below to create a new volunteer opportunity for the community.</p>
                </div>
                
                <div className="form-card">
                    <form onSubmit={onSubmit} className="opportunity-form">
                        <div className="form-group">
                            <label htmlFor="title">Opportunity Title</label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Enter a descriptive title"
                                name="title"
                                value={title}
                                onChange={onChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                placeholder="Describe the volunteer opportunity in detail"
                                name="description"
                                value={description}
                                onChange={onChange}
                                rows="5"
                                required
                            />
                            <small>Include important details like responsibilities, impact, and time commitment.</small>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="skillsRequired">Skills Required</label>
                            <input
                                type="text"
                                id="skillsRequired"
                                placeholder="Communication, Leadership, Teamwork, etc."
                                name="skillsRequired"
                                value={skillsRequired}
                                onChange={onChange}
                                required
                            />
                            <small>Enter skills separated by commas</small>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cause">Cause Area</label>
                                <input
                                    type="text"
                                    id="cause"
                                    placeholder="Education, Environment, Health, etc."
                                    name="cause"
                                    value={cause}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    placeholder="City, State or Remote"
                                    name="location"
                                    value={location}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="date">Event Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={date}
                                onChange={onChange}
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/opportunities')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Create Opportunity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOpportunity; 