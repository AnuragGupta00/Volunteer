import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    // Configure axios defaults
    axios.defaults.baseURL = API_URL;
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    
    const loadUser = async () => {
        if (token) {
            try {
                const res = await axios.get('/api/auth/me');
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error loading user:', err);
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setLoading(false);
    };
    
    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, [token]);
    
    // Register a new user
    const register = async (formData) => {
        try {
            const res = await axios.post('/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await loadUser();
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.msg || 'Registration failed' 
            };
        }
    };
    
    // Login user
    const login = async (formData) => {
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await loadUser();
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.msg || 'Login failed' 
            };
        }
    };
    
    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };
    
    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        loadUser
    };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 