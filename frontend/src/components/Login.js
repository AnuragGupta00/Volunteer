import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={onChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={onChange} required />
            <button type='submit'>Login</button>
        </form>
    );
}

export default Login;