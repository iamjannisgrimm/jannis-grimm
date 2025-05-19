import React, { useEffect, useState, useRef } from "react";
import { quotes } from "../data/quotes";

function useInView(options = {}, delay = 200) {
    const ref = useRef();
    const [inView, setInView] = useState(false);
    const timeoutRef = useRef();
  
    useEffect(() => {
      if (!ref.current) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Delay before setting inView to true
            timeoutRef.current = setTimeout(() => setInView(true), delay);
          } else {
            // If out of view, clear timer and set inView to false
            clearTimeout(timeoutRef.current);
            setInView(false);
          }
        },
        options
      );
      observer.observe(ref.current);
      return () => {
        clearTimeout(timeoutRef.current);
        observer.disconnect();
      };
    }, [options, delay]);
  
    return [ref, inView];
  }

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
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "2rem auto 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
          paddingBottom: isMobile ? "110px" : "200px",
          marginTop: isMobile ? "70px" : "-20px"
        }}
      >
        {quotes.map(({ quote, author }, idx) => {
          // Use intersection observer for each quote
          const [ref, inView] = useInView({ threshold: 0.25 });
          return (
            <div
              key={idx}
              ref={ref}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateY(0) scale(1)"
                  : "translateY(40px) scale(0.97)",
                filter: inView
                  ? "blur(0px)"
                  : "blur(3px)",
                transition:
                  "opacity 0.7s cubic-bezier(0.33,1,0.68,1), transform 0.7s cubic-bezier(0.33,1,0.68,1), filter 0.7s cubic-bezier(0.33,1,0.68,1)",
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
          );
        })}
      </div>
    );
  }