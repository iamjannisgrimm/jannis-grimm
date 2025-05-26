import React, { useState, useEffect, useRef } from 'react';

const ProfileHeader = ({ 
  image, 
  title, 
  titleRef, 
  titleOpacity, 
  imageRef, 
  imageOpacity 
}) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const headerRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 600);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Calculate dynamic margin based on screen size
  const getMarginTop = () => {
    if (windowWidth <= 600) return "0px";
    if (windowWidth <= 768) return "-60px";
    if (windowWidth <= 1024) return "-100px";
    return "-140px"; // Default for large screens
  };

  // Calculate image width based on screen size
  const getImageWidth = () => {
    if (windowWidth <= 480) return "80%";
    if (windowWidth <= 768) return "70%";
    if (windowWidth <= 1024) return "65%";
    return "60%"; // Default for large screens
  };

  // Calculate font size based on screen size
  const getFontSize = () => {
    if (windowWidth <= 480) return "1.8rem";
    if (windowWidth <= 768) return "2.2rem";
    if (windowWidth <= 1024) return "2.5rem";
    return "3rem"; // Default for large screens
  };

  if (isMobile) {
    const lines = title
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `${s}.`);

    return (
      <div ref={headerRef} className="profile-header" style={{ paddingTop: "20px" }}>
        <h1
          ref={titleRef}
          className="profile-title"
          style={{ 
            wordSpacing: "1rem", 
            textAlign: "center",
            opacity: titleOpacity,
            transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
            fontSize: "2.5rem",
            fontWeight: 800
          }}
        >
          {lines.map((line, i) => (
            <span
              key={i}
              style={{
                display: "block",
                marginBottom: i < lines.length - 1 ? "1rem" : 0,
              }}
            >
              {line}
            </span>
          ))}
        </h1>
        <img
          ref={imageRef}
          src={`${import.meta.env.BASE_URL}${image}`}
          alt="Profile"
          className="profile-image"
          style={{
            opacity: imageOpacity,
            transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
            width: getImageWidth(),
            maxWidth: "300px"
          }}
        />
      </div>
    );
  }

  // Desktop: single line
  return (
    <div ref={headerRef} className="profile-header">
      <h1 
        ref={titleRef} 
        className="profile-title"
        style={{
          wordSpacing: "1rem",
          opacity: titleOpacity,
          transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
          marginTop: getMarginTop(),
          fontSize: getFontSize()
        }}
      >
        {title}
      </h1>
      <img 
        ref={imageRef}
        src={`${import.meta.env.BASE_URL}${image}`}
        alt="Profile" 
        className="profile-image"
        style={{
          opacity: imageOpacity,
          transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
          width: getImageWidth(),
          maxWidth: "300px"
        }}
      />
    </div>
  );
};

export default ProfileHeader;