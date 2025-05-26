import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isMobile) {
    const lines = title
      .split(".")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `${s}.`);

    return (
      <div className="profile-header" style={{ paddingTop: "20px" }}>
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
            transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)"
          }}
        />
      </div>
    );
  }

  // Desktop: single line
  return (
    <div className="profile-header">
      <h1 
        ref={titleRef} 
        className="profile-title"
        style={{
          wordSpacing: "1rem",
          opacity: titleOpacity,
          transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
          marginTop: "-140px"
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
          transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)"
        }}
      />
    </div>
  );
};

export default ProfileHeader;