import React from 'react';
import './Header.css';

const Header = ({ onTryNowClick }) => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h2>Style Your Outfit</h2>
        <p>
          Upload an image of your outfit and let our advanced technology analyze the colors in your clothing.
          Discover perfect matching color combinations that elevate your style and create harmonious looks effortlessly.
          Experience a personalized fashion guide that complements your wardrobe.
        </p>
        <button onClick={onTryNowClick} className="hero-button">
          Try Now
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path
              d="M15.1931 6.05818C15.1931 6.31373 15.0879 6.56929 14.9 6.74968L9.96928 11.6804C9.76634 11.8758 9.54085 11.966 9.30784 11.966C8.76667 11.966 8.38333 11.5827 8.38333 11.0791C8.38333 10.801 8.49608 10.5755 8.66895 10.4101L10.3526 8.71144L12.3369 6.90001L10.6307 6.99772H1.76896C1.19772 6.99772 0.806872 6.61439 0.806872 6.05818C0.806872 5.50197 1.19772 5.11864 1.76896 5.11864H10.6307L12.3294 5.21635L10.3526 3.40491L8.66895 1.70622C8.49608 1.53335 8.38333 1.30786 8.38333 1.03727C8.38333 0.526158 8.76667 0.142825 9.30784 0.142825C9.54085 0.142825 9.76634 0.240537 9.9768 0.450995L14.9 5.36667C15.0879 5.54707 15.1931 5.80262 15.1931 6.05818Z"
              fill="#111111"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
