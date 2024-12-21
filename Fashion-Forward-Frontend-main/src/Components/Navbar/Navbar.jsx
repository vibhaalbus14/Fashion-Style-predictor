import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/headerLogo.png';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status
  const navigate = useNavigate();

  // Check if JWT token is in localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token); // Update login state based on token presence
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove token from local storage
    setIsLoggedIn(false); // Update login state
    navigate('/'); // Redirect to home page
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>Fashion Forward</p>
      </div>
      
      <div className="nav-login">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to='/login-signup'><button>Sign Up/Login</button></Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
