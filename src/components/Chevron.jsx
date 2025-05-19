// src/components/Chevron.jsx
import React from "react";
import chevronImg from '../../public/support/chevron.png'; // Adjust if needed

export default function Chevron({ width = 32, height = 32, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        ...style,
      }}
    >
      <img
        src={chevronImg}
        alt="Chevron"
        style={{ width: "100%", height: "25%", display: "block" }}
      />
    </div>
  );
}