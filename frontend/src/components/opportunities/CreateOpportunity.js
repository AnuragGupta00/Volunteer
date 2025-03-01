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
        <div className="create-opportunity-container">
            <h2>Create New Volunteer Opportunity</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Description"
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Skills Required (comma-separated)"
                        name="skillsRequired"
                        value={skillsRequired}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Cause"
                        name="cause"
                        value={cause}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={location}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Create Opportunity
                </button>
            </form>
        </div>
    );
};

export default CreateOpportunity; 