import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Step2.css'
import StepTwo from '../Assets/Step2.png'; // Replace with the correct path to your image

const Step2 = () => {
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
                <h2>Get Personalized Style Tips and Recommendations</h2>
                <p>
                    Dive into your unique style journey! With a selfie or outfit scan, uncover your personal color palette, explore your ideal wardrobe staples, and receive tailored tips to refine your fashion choices.
                </p>
                <ul>
                    <li>1) Your AI stylist is here to guide your everyday look.</li>
                    <li>2) Discover wardrobe essentials that align with your unique style.</li>
                </ul>
            </div>
        </div>
    );
};

export default Step2;
