import React, { useState, useEffect } from 'react';

const ProfileHeader = ({ 
  image, 
  title, 
  titleRef = null, 
  titleOpacity = 1, 
  imageRef = null, 
  imageOpacity = 1,
  stageMode = false,
  forceLandingPageVisibility = false
}) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Add special stage mode class when in staged scrolling
  const headerClass = stageMode ? "stage-profile-header" : "profile-header";

  // Determine base styles for each element
  const imageStyle = {
    maxWidth: stageMode ? "280px" : "300px",
    width: "60%",
    height: "auto",
    borderRadius: "12px",
    objectFit: "cover",
    display: "block",
    opacity: forceLandingPageVisibility ? 1 : imageOpacity,
    transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
    visibility: 'visible'
  };
  
  const titleStyle = {
    margin: stageMode ? "30px 0 0 0" : "0 0 20px 0",
    color: "#000000",
    fontSize: "clamp(2rem, 6vw, 3rem)",
    fontWeight: 800,
    fontFamily: "'SF Pro Display', system-ui, sans-serif",
    letterSpacing: "-1px",
    maxWidth: "800px",
    width: "100%",
    opacity: forceLandingPageVisibility ? 1 : titleOpacity,
    transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
    visibility: 'visible'
  };
  
  // For when we force landing page visibility, add extra styles to ensure everything is visible
  const containerStyle = forceLandingPageVisibility ? {
    display: 'block', 
    visibility: 'visible', 
    opacity: 1
  } : {};

  if (isMobile) {
    const lines = title
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `${s}.`);

    return (
      <div className={headerClass} style={{ 
        paddingTop: stageMode ? "0" : "20px",
        ...containerStyle
      }}>
        <img
          ref={imageRef}
          src={`${import.meta.env.BASE_URL}${image}`}
          alt="Profile"
          className="profile-image"
          style={imageStyle}
        />
        <h1
          ref={titleRef}
          className="profile-title"
          style={titleStyle}
        >
          {lines.map((line, i) => (
            <span
              key={i}
              style={{
                display: "block",
                marginBottom: i < lines.length - 1 ? "1rem" : 0,
                ...containerStyle
              }}
            >
              {line}
            </span>
          ))}
        </h1>
      </div>
    );
  }

  // Desktop: single line with image below (reversed from mobile) when in stage mode
  if (stageMode) {
    return (
      <div className={headerClass} style={containerStyle}>
        <img 
          ref={imageRef}
          src={`${import.meta.env.BASE_URL}${image}`}
          alt="Profile" 
          className="profile-image"
          style={imageStyle}
        />
        <h1 
          ref={titleRef} 
          className="profile-title"
          style={titleStyle}
        >
          {title}
        </h1>
      </div>
    );
  }

  // Desktop normal view: title above image
  return (
    <div className={headerClass} style={containerStyle}>
      <h1 
        ref={titleRef} 
        className="profile-title"
        style={titleStyle}
      >
        {title}
      </h1>
      <img 
        ref={imageRef}
        src={`${import.meta.env.BASE_URL}${image}`}
        alt="Profile" 
        className="profile-image"
        style={imageStyle}
      />
    </div>
  );
};

export default ProfileHeader;