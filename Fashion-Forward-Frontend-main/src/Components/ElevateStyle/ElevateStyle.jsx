import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ElevateStyle.css"; // Ensure styles are in ElevateStyle.css

const ElevateStyle = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleJoinNowClick = () => {
    navigate('/login-signup'); // Navigate to /login-signup
  };

  return (
    <div className="elevate-style-container">
      <h2>Elevate your style</h2>
      <button className="cta-button" onClick={handleJoinNowClick}>
        Join now →
      </button>
    </div>
  );
};

export default ElevateStyle;
