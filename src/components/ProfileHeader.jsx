import React from "react";

const ProfileHeader = ({ image, title }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        padding: "80px 0",
        margin: 0,
        textAlign: "center",
        boxSizing: "border-box"
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "black",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 800,
          textAlign: "center",
          fontFamily: "SF Pro",
          letterSpacing: "-1px",
          padding: 0,
          margin: "0 0 30px 0",
          width: "100%",
          maxWidth: "800px"
        }}
      >
        {title.split(". ").map((part, i, arr) => (
          <span key={i} className="title-part">
            {part}{i < arr.length - 1 ? "." : ""}
          </span>
        ))}
      </h1>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: 0,
        padding: 0,
        position: "relative"
      }}>
        <img
          src={`${import.meta.env.BASE_URL}${image}`}
          alt="Profile"
          style={{
            maxWidth: "400px",
            width: "90%",
            height: "auto",
            borderRadius: "12px",
            objectFit: "cover",
            display: "block",
            margin: 0
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to bottom, transparent, white)",
          borderRadius: "0 0 12px 12px",
          pointerEvents: "none"
        }} />
      </div>
    </div>
  );
};

export default ProfileHeader;
