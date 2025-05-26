import React from "react";
import { FaRobot, FaLightbulb, FaQuestionCircle, FaComments } from "react-icons/fa";
import conversationPrompts from "../../data/prompts";

const iconMap = [FaRobot, FaLightbulb, FaQuestionCircle, FaComments];

export default function ConversationStarters({
  onSelectPrompt,
  mobile = false
}) {
  // ─── MOBILE LAYOUT ───────────────────────────────────────────────
  if (mobile) {
    return (
      <div className="mobile-starters-wrapper"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "auto",
          overflow: "hidden",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "6px",
          position: "absolute",
          bottom: "54px", // Positioned closer to the input bar
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: "#ffffff"
        }}
      >
        <h3 style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "8px", // Reduced margin
          marginTop: "8px", // Reduced margin
          color: "#111827",
          fontFamily: "SF Pro Display, system-ui, sans-serif"
        }}>
          Ask me something...
        </h3>
        <div style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "2px", // Reduced padding
          paddingLeft: "10px",
          paddingRight: "10px"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            paddingRight: "20px"
          }}>
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
                  minWidth: "230px",
                  maxWidth: "230px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  textAlign: "left",
                  fontSize: "14px",
                  lineHeight: "1.3",
                  fontWeight: "400",
                  color: "#333",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)";
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                <div style={{ 
                  marginRight: "10px",
                  color: "#2563eb", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  {React.createElement(iconMap[idx % iconMap.length], { size: 16 })} {/* Further reduced icon size */}
                </div>
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // ─── DESKTOP LAYOUT ──────────────────────────────────
  return (
    <>
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
              backgroundColor: "#ffffff", // Explicitly white background
              color: "#333",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              transition: "all 0.2s ease",
              minWidth: "310px",
              height: "140px"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(0,0,0,0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.boxShadow =
                "0 6px 12px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Icon size={36} style={{ marginBottom: "12px", color: "#2563eb" }} />
            {prompt}
          </button>
        );
      })}
    </>
  );
}