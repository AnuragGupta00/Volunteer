import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import OpportunityList from './components/opportunities/OpportunityList';
import OpportunityDetail from './components/opportunities/OpportunityDetail';
import CreateOpportunity from './components/opportunities/CreateOpportunity';
import UserList from './components/users/UserList';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import './index.css';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.reload();
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <Router>
            <div className="app">
                <nav className="navbar">
                    <div className="navbar-container">
                        <div className="nav-brand">
                            <Link to="/" onClick={closeMenu}>
                                <span>Volunteer Connect</span>
                            </Link>
                        </div>
                        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                            <Link to="/opportunities" onClick={closeMenu}>Opportunities</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                                    <Link to="/users" onClick={closeMenu}>Community</Link>
                                    <Link to="/opportunities/create" onClick={closeMenu}>Create Opportunity</Link>
                                    <button onClick={() => { handleLogout(); closeMenu(); }} className="btn btn-link">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={closeMenu}>Login</Link>
                                    <Link to="/register" onClick={closeMenu}>Register</Link>
                                </>
                            )}
                        </div>
                        <button 
                            className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`} 
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                    </div>
                </nav>

                <main className="page-container">
                    <Routes>
                        <Route path="/" element={<OpportunityList />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/opportunities" element={<OpportunityList />} />
                        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                        <Route path="/opportunities/create" element={<CreateOpportunity />} />
                        <Route path="/users" element={<UserList />} />
                    </Routes>
                </main>

                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-section">
                            <h3>Volunteer Connect</h3>
                            <p>Connecting volunteers with meaningful opportunities to make a difference in communities around the world.</p>
                        </div>
                        <div className="footer-section">
                            <h3>Quick Links</h3>
                            <ul className="footer-links">
                                <li><Link to="/opportunities">Find Opportunities</Link></li>
                                <li><Link to="/users">Community</Link></li>
                                {isAuthenticated ? (
                                    <li><Link to="/dashboard">My Dashboard</Link></li>
                                ) : (
                                    <>
                                        <li><Link to="/login">Login</Link></li>
                                        <li><Link to="/register">Register</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Contact Us</h3>
                            <ul className="footer-links">
                                <li><a href="mailto:support@volunteerconnect.org">support@volunteerconnect.org</a></li>
                                <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                                <li>123 Volunteer St., Community City</li>
                            </ul>
                        </div>
                    </div>
                    <div className="container">
                        <div className="copyright">
                            &copy; {new Date().getFullYear()} Volunteer Connect. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;