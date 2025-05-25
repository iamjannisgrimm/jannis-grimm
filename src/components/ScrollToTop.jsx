import React, { useState, useEffect } from 'react';

const ScrollToTop = ({ mobileOnly = true }) => {
  const [visible, setVisible] = useState(false);
  
  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // On mobile, only show for smaller screens if mobileOnly is true
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  if (mobileOnly && !isMobile) return null;
  
  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        height: '45px',
        width: '45px',
        fontSize: '16px',
        borderRadius: '50%',
        border: 'none',
        background: '#2563eb',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        display: visible ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 999,
      }}
      aria-label="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5L5 12M12 5L19 12M12 5V19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop; 