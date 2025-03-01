import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar"; // Optional Navbar

function App() {
  return (
    <Router>
      <Navbar /> {/* Common Navbar for navigation (optional) */}
      <Routes>
        <Route path="/" element={<Login />} />  {/* Default route to Login */}
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;