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
        <h2>Upload Your Outfit and Let AI Do the Rest</h2>
        <p>
          Snap a photo or upload an image of your outfit to our platform. Our cutting-edge technology will analyze the colors and patterns to provide expert suggestions for complementary combinations and style enhancements.
        </p>
      </div>
      <div className="step-image">
        <img src={stepImage} alt="Style DNA Step One" />
      </div>
    </div>
  );
};

export default StepOne;
