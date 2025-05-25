// src/components/Chevron.jsx
import React from "react";

/**
 * An animated chevron component that suggests scrolling down
 */
const Chevron = () => {
  const bounceKeyframes = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
  `;
  
  // Define inline animation style as backup
  const animationStyle = {
    animation: 'bounce 1.5s infinite',
    WebkitAnimation: 'bounce 1.5s infinite', // For Safari
    animationName: 'bounce',
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      opacity: 0.8,
      marginBottom: '20px',
      ...animationStyle
    }}>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#444'
      }}>
        Scroll to explore
      </div>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      
      {/* Add keyframes animation */}
      <style>{bounceKeyframes}</style>
    </div>
  );
};

export default Chevron;