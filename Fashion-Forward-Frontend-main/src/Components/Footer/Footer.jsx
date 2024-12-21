import React from "react";
import "./Footer.css"; // Ensure styles are in Footer.css
import { FaInstagram, FaTiktok, FaLinkedin, FaFacebook } from 'react-icons/fa';
import logo from '../Assets/headerLogo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Company Name */}
        <div className="footer-logo">
          <div className="logo-circle">
            <img src={logo} alt="Company Logo" /> {/* Replace with actual logo image path */}
          </div>
          <span className="company-name">Fashion Forward</span>
        </div>
        
        {/* Company Info */}
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
            <li><a href="/press">Press</a></li>
          </ul>
        </div>

        {/* Product Info */}
        <div className="footer-column">
          <h3>Product</h3>
          <ul>
            <li><a href="/color-analysis">Color Analysis</a></li>
            <li><a href="/style-type">Style Type</a></li>
            <li><a href="/fit-guide">Fit Guide</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/returns">Return Policy</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="footer-social">
            <a href="https://www.instagram.com/styledna.app/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} /> {/* Instagram icon */}
            </a>
            <a href="https://www.linkedin.com/company/style-dna" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} /> {/* LinkedIn icon */}
            </a>
            <a href="https://www.facebook.com/p/Style-DNA-100063949751183/" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} /> {/* Facebook icon */}
            </a>
          </div>
        </div>

        {/* Legal Info */}
        <div className="footer-bottom">
          <p>&copy; 2024 Fashion Forward. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
