import React, { useState, useEffect } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import TimelineItem from "./TimelineItem";

export default function Timeline({ items }) {
  const [isReversed, setIsReversed] = useState(false);
  const [animatedData, setAnimatedData] = useState(items);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setAnimatedData(items);
  }, [items]);

  const handleSortToggle = () => {
    setIsReversed(r => !r);
    setAnimatedData(d => d.map(item => ({ ...item, isFadingOut: true })));
    setTimeout(() => {
      setAnimatedData(d => 
        [...d].reverse().map(item => ({
          ...item,
          isFadingOut: false,
          isFadingIn: true
        }))
      );
    }, 250);
  };

  const bgColor = !isReversed ? "#2A2A2A" : "#ffffff";
  const txtColor = !isReversed ? "#ffffff" : "#000000";

  return (
    <div className="timeline-container">
      <div className="timeline-header" style={{ backgroundColor: bgColor, color: txtColor }}>
        <div className="timeline-header-content">
          <p className="timeline-title" style={{ color: txtColor }}>
            The projects and experiences that have inspired me over the years...
          </p>
          <button 
            className="timeline-sort-button" 
            onClick={handleSortToggle}
            style={{ color: txtColor }}
          >
            <ArrowsUpDownIcon 
              className="timeline-sort-icon" 
              style={{ transform: isReversed ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </div>

      <div className="timeline-items">
        {animatedData.map((item, i) => (
          <div
            key={i}
            className="timeline-item-wrapper"
            style={{
              opacity: item.isFadingOut ? 0 : 1,
              transform: item.isFadingIn ? "scale(1.02)" : "scale(1)",
              transition: "opacity .3s ease, transform .3s ease"
            }}
          >
            <TimelineItem {...item} screenWidth={screenWidth} />
          </div>
        ))}
      </div>
    </div>
  );
}