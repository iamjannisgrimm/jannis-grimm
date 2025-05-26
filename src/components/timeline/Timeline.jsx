import React, { useState, useEffect } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import TimelineItem from "./TimelineItem";

export default function Timeline({ items }) {
  const [isReversed, setIsReversed] = useState(false);
  const [animatedData, setAnimatedData] = useState(items);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // keep track of window width
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // reset animatedData whenever items change
  useEffect(() => {
    setAnimatedData(items);
  }, [items]);

  const handleSortToggle = () => {
    setIsReversed(r => !r);

    // trigger fade-out
    setAnimatedData(d => d.map(item => ({ ...item, isFadingOut: true })));

    // then reverse & fade-in
    setTimeout(() => {
      setAnimatedData(d =>
        [...d]
          .reverse()
          .map(item => ({
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
      <div
        className="timeline-header"
        style={{ 
          backgroundColor: bgColor, 
          color: txtColor,
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative'
        }}
      >
        <div 
          className="timeline-header-content" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '800px',
            width: '100%'
          }}
        >
          <h2 
            className="timeline-title" 
            style={{ 
              color: txtColor, 
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: 600,
              margin: 0,
              fontFamily: "'SF Pro Display', system-ui, sans-serif"
            }}
          >
            The projects and experiences that have inspired me over the years...
          </h2>
        </div>
        
        <button
          className="timeline-sort-button"
          onClick={handleSortToggle}
          style={{ 
            color: txtColor, 
            background: 'none',
            border: `1px solid ${txtColor}`,
            borderRadius: '30px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.8rem',
            opacity: 0.7
          }}
        >
          <span>Toggle</span>
          <ArrowsUpDownIcon
            className="timeline-sort-icon"
            style={{
              width: '16px',
              height: '16px',
              color: txtColor
            }}
          />
        </button>
      </div>

      <div 
        className="timeline-items"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        {animatedData.map((item, i) => {
          // when reversed, swap top/bottom spacing
          const topSpacing = isReversed
            ? item.bottomSpacing
            : item.topSpacing;
          const bottomSpacing = isReversed
            ? item.topSpacing
            : item.bottomSpacing;

          return (
            <div
              key={i}
              className="timeline-item-wrapper"
              style={{
                opacity: item.isFadingOut ? 0 : 1,
                transform: item.isFadingIn ? "scale(1.02)" : "scale(1)",
                transition: "opacity .3s ease, transform .3s ease",
                width: '100%'
              }}
            >
              <TimelineItem
                {...item}
                screenWidth={screenWidth}
                topSpacing={topSpacing}
                bottomSpacing={bottomSpacing}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}