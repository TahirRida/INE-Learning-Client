import React from "react";
import AboutBackground from "../../Assets/about-background.png";
import AboutBackgroundImage from "../../Assets/image 3.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container" id="about">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          An e-platform from INEs to INEs
        </h1>
        <p className="primary-text">
          INElearning serves as a dynamic hub for students eager to exchange expertise and expand their horizons. Here, individuals can seamlessly share their skills for others to learn and grow from.
        </p>
        <p className="primary-text">
          Join us to exchange knowledge and expand horizons effortlessly.
        </p>

        <div className="about-buttons-container">
          <button className="secondary-button">
            <span className="watch-video-button"><BsFillPlayCircleFill /></span>
            <span className="button-text">Watch Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
