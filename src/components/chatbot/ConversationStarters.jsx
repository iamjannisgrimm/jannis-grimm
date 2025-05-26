import React from "react";
import { FaRobot, FaLightbulb, FaQuestionCircle, FaComments, FaLaptopCode, FaRocket } from "react-icons/fa";
import conversationPrompts from "../../data/prompts";

// Expanded icon map for 6 prompts
const iconMap = [FaLaptopCode, FaRobot, FaLightbulb, FaRocket, FaQuestionCircle, FaComments];

export default function ConversationStarters({
  onSelectPrompt,
  mobile = false
}) {
  // ─── MOBILE LAYOUT ───────────────────────────────────────────────
  if (mobile) {
    return (
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "10px 0"
        }}
      >
        <h3 style={{
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "8px",
          marginTop: "0",
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
          paddingBottom: "5px",
          paddingLeft: "10px",
          paddingRight: "10px",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none" /* IE and Edge */
        }}>
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            paddingRight: "20px" // Extra padding at the end for better scrolling
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
                  border: "none",
                  background: "#f7f7f7",
                  textAlign: "left",
                  fontSize: "14px",
                  lineHeight: "1.3",
                  fontWeight: "400",
                  color: "#333",
                  boxShadow: "none",
                  transition: "transform 0.2s ease",
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ 
                  marginRight: "10px",
                  color: "#2563eb", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  {React.createElement(iconMap[idx % iconMap.length], { size: 16 })}
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
    <div className="desktop-starters-container">
      <h2 className="desktop-starters-title">
        Discover my professional experience
      </h2>
      
      <div className="desktop-starters-grid">
        {conversationPrompts.map((prompt, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <button
              key={index}
              onMouseDown={(e) => e.preventDefault()}  
              onClick={(e) => {
                e.stopPropagation();
                onSelectPrompt(prompt);
              }}
              className="starter-button"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 16px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                color: "#1f2937",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily:
                  "SF Pro Display, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                transition: "all 0.3s ease",
                width: "100%",
                height: "140px",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.querySelector('.icon-wrapper').style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.querySelector('.icon-wrapper').style.transform = "scale(1)";
              }}
            >
              <div 
                className="icon-wrapper"
                style={{
                  background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                  transition: "transform 0.3s ease"
                }}
              >
                <Icon size={24} style={{ color: "#2563eb" }} />
              </div>
              <span style={{
                lineHeight: "1.4",
                maxWidth: "100%",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>{prompt}</span>
            </button>
          );
        })}
      </div>
      
      <style jsx="true">{`
        .desktop-starters-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 650px;
          margin: 0 auto;
          padding: 16px 0;
          position: relative;
        }
        
        .desktop-starters-title {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 24px;
          text-align: center;
          font-family: "SF Pro Display", system-ui, sans-serif;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .desktop-starters-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, auto);
          gap: 16px;
          width: 100%;
          margin: 0 auto;
        }
        
        @media (max-width: 700px) {
          .desktop-starters-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, auto);
          }
          
          .desktop-starters-container {
            max-width: 450px;
          }
        }
        
        @media (min-width: 1100px) {
          .desktop-starters-container {
            max-width: 700px;
          }
          
          .desktop-starters-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}