import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Step3.css';
import stepImage from '../Assets/Step1.png'; // Adjust path to your combined image

const Step3 = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
      navigate('/style-your-outfit');
  };
  return (
    <div className="step-one-container">
      <div className="step-content">
        <div className="step-number">3.</div>
        <h2>Shop the Perfect Matches for Your Style</h2>
        <p>
          Upload an image of your outfit, and our AI will analyze its dominant colors to suggest the best complementary clothing and accessories from our store.
        </p>
      </div>
      <div className="step-image">
        <img src={stepImage} alt="Style DNA Step One" />
      </div>
    </div>
  );
};

export default Step3;
