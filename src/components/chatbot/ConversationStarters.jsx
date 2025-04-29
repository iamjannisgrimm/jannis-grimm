import React, { useEffect, useState } from "react";
import { FaRobot, FaLightbulb, FaQuestionCircle, FaComments } from "react-icons/fa"; // Example icons
import conversationPrompts from "../../data/prompts";

const iconMap = [FaRobot, FaLightbulb, FaQuestionCircle, FaComments];

const ConversationStarters = ({ onSelectPrompt }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100); // Small delay to trigger animation
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr", // 2x2 grid layout
        gap: "30px", // Increased gap for better spacing
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 40px", // Extra padding for breathing room
        maxWidth: "650px", // Slightly wider for better spacing
        margin: "0 auto", // Ensures centering
      }}
    >
      {conversationPrompts.slice(0, 4).map((prompt, index) => {
        const Icon = iconMap[index % iconMap.length]; // Assigns an icon from the map
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPrompt(prompt);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "#ffffff",
              color: "#333",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              fontSize: "14px", // Slightly larger text for better readability
              fontWeight: "500",
              fontFamily: "SF Pro, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              transition: "all 0.3s ease-in-out",
              minWidth: "160px", // Slightly wider buttons
              height: "140px", // Slightly taller for breathing room

              // 👇 Animation styles
              opacity: visible ? "1" : "0",
              transform: visible ? "scale(1)" : "scale(0.85)",
              transition: `opacity 0.5s ease-in-out ${(index * 100)}ms, transform 0.5s ease-in-out ${(index * 100)}ms`,
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
              e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.1)";
            }}
          >
            <Icon size={36} style={{ marginBottom: "12px", color: "#2563eb" }} />
            {prompt}
          </button>
        );
      })}
    </div>
  );
};

export default ConversationStarters;