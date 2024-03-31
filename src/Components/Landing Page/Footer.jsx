import React from "react";
import Logo from "../../Assets/inelogo.png";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container">
          <img src={Logo} alt="" className="footer-logo-img" />
        </div>
        <div className="footer-icons">
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>About Us</span>
          <span>Contact</span>
          <span>How</span>
          <span>Testimonials</span>
        </div>
        <div className="footer-section-columns">
          <span>+212 53 33 77 83 85</span>
          <span>support@ine.learning</span>
          <span>contact@ine.learning</span>
        </div>
        <div className="footer-section-columns">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>

        </div>
      </div>
      <div className="bottom-right-text">
        <span>© 2024 INElearning, Inc.</span>
      </div>
    </div>
  );
};

export default Footer;
