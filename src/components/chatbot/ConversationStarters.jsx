import React, { useState, useEffect } from "react";
import { FaRobot, FaLightbulb, FaQuestionCircle, FaComments } from "react-icons/fa";
import conversationPrompts from "../../data/prompts";

const iconMap = [FaRobot, FaLightbulb, FaQuestionCircle, FaComments];

export default function ConversationStarters({
  onSelectPrompt,
  mobile = false
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // ─── MOBILE LAYOUT ───────────────────────────────────────────────
  if (mobile) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "12px",
          padding: "0 1rem",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {conversationPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPrompt(prompt);
            }}
            style={{
              flex: "0 0 auto",
              width: "230px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              textAlign: "left",
              fontSize: "14px",
              lineHeight: "1.2",
              display: visible ? "-webkit-box" : "none",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transition: `opacity 0.4s ease ${idx * 0.05}s`,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    );
  }
  // ─── DESKTOP LAYOUT (unchanged) ──────────────────────────────────
  return (
    <div onClick={(e) => e.stopPropagation()} className="starters-wrapper">
      {conversationPrompts.slice(0, 4).map((prompt, index) => {
        const Icon = iconMap[index % iconMap.length];
        return (
          <button
            key={index}
            onMouseDown={(e) => e.preventDefault()}  
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
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              color: "#333",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              transition: "all 0.3s ease-in-out",
              minWidth: "310px",
              height: "140px",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
              transition: `opacity 0.5s ease-in-out ${index * 100}ms, transform 0.5s ease-in-out ${
                index * 100
              }ms`,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(0,0,0,0.1)";
            }}
          >
            <Icon size={36} style={{ marginBottom: "12px", color: "#2563eb" }} />
            {prompt}
          </button>
        );
      })}
    </div>
  );
}