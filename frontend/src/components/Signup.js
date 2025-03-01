import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type='text' name='name' placeholder='Name' value={formData.name} onChange={onChange} required />
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={onChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={onChange} required />
            <button type='submit'>Sign Up</button>
        </form>
    );
}

export default Signup;