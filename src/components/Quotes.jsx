import React, { useEffect, useState, useRef } from "react";
import { quotes } from "../data/quotes";

// Simple component with no fancy animations
export default function Quotes() {
    const [isMobile, setIsMobile] = useState(
      typeof window !== "undefined" ? window.innerWidth <= 600 : false
    );
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize, { passive: true });
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return (
        <div
          className="quotes-container"
          style={{
            width: "100%",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: isMobile ? "30px" : "10px",
            marginBottom: isMobile ? "60px" : "100px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          {quotes.map(({ quote, author }, idx) => (
            <div
              key={idx}
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#22223b",
                  lineHeight: 1.6,
                  marginBottom: "0.65rem",
                  fontStyle: "italic",
                }}
              >
                {quote}
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#7a7a89",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                — {author}
              </div>
            </div>
          ))}
        </div>
      );
  }