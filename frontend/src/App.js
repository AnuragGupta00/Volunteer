import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import OpportunityList from './components/opportunities/OpportunityList';
import OpportunityDetail from './components/opportunities/OpportunityDetail';
import CreateOpportunity from './components/opportunities/CreateOpportunity';
import './App.css';
import './index.css';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.reload();
    };

    return (
        <Router>
            <div className="app">
                <nav className="navbar">
                    <div className="nav-brand">
                        <Link to="/">Volunteer Connect</Link>
                    </div>
                    <div className="nav-links">
                        <Link to="/opportunities">Opportunities</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/opportunities/create">Create Opportunity</Link>
                                <button onClick={handleLogout} className="btn btn-link">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/" element={<OpportunityList />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/opportunities" element={<OpportunityList />} />
                        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                        <Route path="/opportunities/create" element={<CreateOpportunity />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;