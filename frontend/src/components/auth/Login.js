import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({ email, password });

            console.log(body);

            const res = await axios.post('http://localhost:3001/api/auth/login', body, config);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get('http://localhost:3001/api/auth/users', config);
            return res.data; // Array of users
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login; 