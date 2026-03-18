import React from "react";
import { TrendingUp } from "lucide-react";
import "./PremiumLoader.css";

const PremiumLoader = ({ message = "Loading Sohanix Wealth..." }) => {
  return (
    <div 
      className="premium-loader-container" 
      role="status" 
      aria-live="polite"
    >
      <div className="premium-loader-content">
        <div className="loader-logo-wrapper">
          <TrendingUp className="loader-icon" size={40} />
        </div>
        
        <h2 className="loader-message">{message}</h2>
        
        <div className="loader-bar-container">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;