import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Step3.css';
import stepImage from '../Assets/Step1.png'; // Adjust path to your combined image

const Step3Analysis = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
      navigate('/style-your-outfit');
  };
  return (
    <div className="step-one-container">
      <div className="step-content">
        <div className="step-number">3.</div>
        <h2>Get Personalized Fashion Insights</h2>
        <p>
        <ul>
            <li>1) With a single image, unlock tailored fashion recommendations.</li>
            <li>2) Transform your outfit into a masterpiece with harmonious color blends and modern styles.</li>
        </ul>
        </p>
        <button className="join-now-button" onClick={handleButtonClick}>
            Upload now →
        </button>
      </div>
      <div className="step-image">
        <img src={stepImage} alt="Style DNA Step One" />
      </div>
    </div>
  );
};

export default Step3Analysis;
