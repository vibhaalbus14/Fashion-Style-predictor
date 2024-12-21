import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Step1.css';
import stepImage from '../Assets/Step1.png'; // Adjust path to your combined image

const StepOne = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
      navigate('/style-your-outfit');
  };
  return (
    <div className="step-one-container">
      <div className="step-content">
        <div className="step-number">1.</div>
        <h2>Upload Your Outfit Image</h2>
        <p>
            Share your unique style by uploading a picture of your outfit.
            Let our AI analyze the colors to recommend stunning combinations that elevate your wardrobe.
        </p>
        <button className="join-now-button" onClick={handleButtonClick}>
          Start now →
        </button>
      </div>
      <div className="step-image">
        <img src={stepImage} alt="Style DNA Step One" />
      </div>
    </div>
  );
};

export default StepOne;
