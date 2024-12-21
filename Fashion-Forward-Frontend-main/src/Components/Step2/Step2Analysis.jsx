import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Step2.css'
import StepTwo from '../Assets/Step2.png'; // Replace with the correct path to your image

const Step2Analysis = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/style-your-outfit');
    };

    return (
        <div className="step2-container">
            <div className="step2-image-section">
                <img src={StepTwo} alt="Step 2 - Outfit Ideas" className="step2-image" />
            </div>
            <div className="step2-content">
                <div className="step-number">2.</div>
                <h2>Discover Your Color Harmony</h2>
                <p>
                    Scan your own items to get them paired by occasion or to be inspired by new outfit ideas:
                </p>
                <ul>
                    <li>1) Submit your outfit image to uncover the dominant colors and receive expert suggestions for pairing and styling.</li>
                    <li>2) Create the perfect look for any occasion.</li>
                </ul>
                <button className="join-now-button" onClick={handleButtonClick}>
                    Try it now →
                </button>
            </div>
        </div>
    );
};

export default Step2Analysis;
