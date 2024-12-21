import React from 'react';
import './About.css';

const About = () => {
    return (
        <section className="about">
            <div className="about-container">
                <div className="about-cards">
                    <div className="card technology-card">
                        <h3>Our Technology</h3>
                        <p>
                            At Fashion Forward, we leverage cutting-edge AI technology to help you discover your perfect outfits. 
                            Our system analyzes your personal style, preferences, and the latest fashion trends to provide tailored recommendations that help you look your best, effortlessly.
                        </p>
                    </div>
                    <div className="card mission-card">
                        <h3>Our Mission</h3>
                        <p>
                            Our mission is to empower individuals to make confident fashion choices, enhancing their personal style through data-driven insights. 
                            We believe that technology can make fashion accessible and enjoyable for everyone.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
