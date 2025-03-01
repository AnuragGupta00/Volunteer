import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        skills: '',
        interests: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, confirmPassword, skills, interests } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({ 
                name, 
                email, 
                password, 
                skills: skills.split(',').map(skill => skill.trim()),
                interests: interests.split(',').map(interest => interest.trim())
            });

            const res = await axios.post('/api/auth/register', body, config);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setLoading(false);
                navigate('/dashboard');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
            console.error(err.response?.data);
        }
    };

    return (
        <div className="register-container">
            <div className="auth-header">
                <h2>Create Account</h2>
                <p>Join the Volunteer Connect community</p>
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
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your full name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
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
                            placeholder="Create a password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength="6"
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        required
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="skills">Skills (comma-separated)</label>
                    <input
                        type="text"
                        id="skills"
                        placeholder="e.g. Teaching, Coding, First Aid"
                        name="skills"
                        value={skills}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="interests">Interests (comma-separated)</label>
                    <input
                        type="text"
                        id="interests"
                        placeholder="e.g. Environment, Education, Healthcare"
                        name="interests"
                        value={interests}
                        onChange={onChange}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            
            <div className="auth-footer">
                Already have an account? <Link to="/login">Sign In</Link>
            </div>
        </div>
    );
};

export default Register; 