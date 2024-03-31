import React from 'react';
import HashLoader from "react-spinners/HashLoader";
import Logo from "../Assets/inelogo.png";

const LoadingPage = ({ loading }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-popup">
        <HashLoader color="#392467" loading={loading} size={150} aria-label="INElearning" />
      </div>
      <div className="nav-logo-container1">
        <img src={Logo} alt="Logo" className="nav-logo-img" />
      </div>
    </div>
  );
};

export default LoadingPage;