import React, { useEffect, useState } from "react";
import { quotes } from "../data/quotes";

export default function Quotes() {
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  useEffect(() => {
    quotes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleIndexes((prev) => [...prev, idx]);
      }, idx * 250); // 250ms stagger
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "2rem auto 0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center",
        paddingBottom: "100px",
        paddingTop: "40px"
      }}
    >
      {quotes.map(({ quote, author }, idx) => (
        <div
          key={idx}
          style={{
            opacity: visibleIndexes.includes(idx) ? 1 : 0,
            transform: visibleIndexes.includes(idx)
              ? "translateY(0)"
              : "translateY(40px)",
            transition:
              "opacity 0.7s cubic-bezier(0.33,1,0.68,1), transform 0.7s cubic-bezier(0.33,1,0.68,1)",
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