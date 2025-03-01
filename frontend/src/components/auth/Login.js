import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({ email, password });

            const res = await axios.post('/api/auth/login', body, config);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setLoading(false);
                navigate('/dashboard');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
            console.error(err.response?.data);
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
            <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to continue to Volunteer Connect</p>
            </div>
            
            {error && (
                <div className="alert alert-danger" style={{ 
                    backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                    color: 'var(--error-color)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    {error}
                </div>
            )}
            
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                        <button 
                            type="button" 
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            
            <div className="auth-footer">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
        </div>
    );
};

export default Login; 