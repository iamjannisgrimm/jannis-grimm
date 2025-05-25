import React, { useEffect, useState, useRef } from "react";
import { quotes } from "../data/quotes";

// Simple component with no fancy animations
export default function Quotes({ stageMode = false }) {
    const [isMobile, setIsMobile] = useState(
      typeof window !== "undefined" ? window.innerWidth <= 600 : false
    );
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize, { passive: true });
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    // In stage mode, use different styling to fit the centered stage look
    const containerStyle = {
      width: "100%",
      maxWidth: stageMode ? 700 : 600,
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: stageMode ? 0 : (isMobile ? "30px" : "30px"),
      marginBottom: stageMode ? 0 : (isMobile ? "60px" : "120px"),
      display: "flex",
      flexDirection: "column",
      gap: stageMode ? "2.5rem" : "2rem",
      alignItems: "center",
      padding: stageMode ? "20px" : 0
    };

    // Enhanced text styles for stage mode
    const quoteStyle = {
      fontSize: stageMode ? (isMobile ? "1.3rem" : "1.5rem") : "1.2rem",
      fontWeight: 600,
      color: "#22223b",
      lineHeight: 1.6,
      marginBottom: "0.65rem",
      fontStyle: "italic",
      textAlign: "center"
    };

    const authorStyle = {
      fontSize: stageMode ? "1.1rem" : "1rem",
      color: "#7a7a89",
      fontWeight: 500,
      textAlign: "center"
    };
  
    return (
        <div style={containerStyle}>
          {quotes.map(({ quote, author }, idx) => (
            <div
              key={idx}
              style={{
                width: "100%",
                textAlign: "center",
                animation: stageMode ? "fadeInUp 0.8s ease-out" : "none"
              }}
            >
              <div style={quoteStyle}>
                {quote}
              </div>
              <div style={authorStyle}>
                — {author}
              </div>
            </div>
          ))}
        </div>
      );
  }