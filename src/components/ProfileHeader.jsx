import React, { useState, useEffect } from "react";

const ProfileHeader = ({ image, title }) => {
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
      <div className="profile-header">
        <h1
          className="profile-title"
          style={{ wordSpacing: "1rem", textAlign: "center" }}
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
          src={`${import.meta.env.BASE_URL}${image}`}
          alt="Profile"
          className="profile-image"
        />
      </div>
    );
  }

  // Desktop: single line
  return (
    <div className="profile-header">
      <h1
        className="profile-title"
        style={{
          wordSpacing: "1rem",
        }}
      >
        {title}
      </h1>
      <img
        src={`${import.meta.env.BASE_URL}${image}`}
        alt="Profile"
        className="profile-image"
      />
    </div>
  );
};

export default ProfileHeader;