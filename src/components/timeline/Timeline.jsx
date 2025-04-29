import React, { useState, useEffect } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import TimelineItem from "./TimelineItem";

const Timeline = ({ items }) => {
  const [isReversed, setIsReversed] = useState(false);
  const [animatedData, setAnimatedData] = useState(items || []);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set initial data
  useEffect(() => {
    if (items) {
      setAnimatedData(items);
    }
  }, [items]);

  // Toggle sorting order with smooth transition
  const handleSortToggle = () => {
    setIsReversed((prev) => !prev);

    // Add a fade-out effect before reordering
    setAnimatedData((prevData) =>
      prevData.map((item) => ({ ...item, isFadingOut: true }))
    );

    setTimeout(() => {
      setAnimatedData((prevData) => {
        const reversedData = [...prevData].reverse();
        return reversedData.map((item) => ({
          ...item,
          isFadingOut: false,
          isFadingIn: true,
        }));
      });
    }, 250); // 250ms to sync with animation timing
  };

  // Dynamic styling based on sorting order
  const isOldestFirst = !isReversed;
  const backgroundColor = isOldestFirst ? "#2A2A2A" : "#ffffff";
  const textColor = isOldestFirst ? "#ffffff" : "#000000";

  return (
    <div className="timeline-container">
      {/* Timeline Header Section */}
      <div 
        className="timeline-header"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        {/* Title & Sort Button Row */}
        <div className="timeline-header-content">
          {/* Title - Stays Centered */}
          <p 
            className="timeline-title"
            style={{ color: textColor }}
          >
            The projects and experiences that have inspired me over the years...
          </p>

          {/* Sort Button */}
          <button
            onClick={handleSortToggle}
            className="timeline-sort-button"
            style={{ color: textColor }}
          >
            <ArrowsUpDownIcon
              style={{
                transform: isReversed ? "rotate(180deg)" : "rotate(0deg)",
              }}
              className="timeline-sort-icon"
            />
          </button>
        </div>
      </div>

      {/* Timeline Items with Smooth Animation */}
      <div className="timeline-items">
        {animatedData.map((item, index) => (
          <div
            key={index}
            className="timeline-item-wrapper"
            style={{
              opacity: item.isFadingOut ? 0 : 1,
              transform: item.isFadingIn ? "scale(1.02)" : "scale(1)",
            }}
          >
            <TimelineItem
              date={item.date}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              secondDescription={item.secondDescription}
              icon={item.icon}
              image={item.image}
              techStack={item.techStack}
              background={item.background}
              topSpacing={item.topSpacing}
              bottomSpacing={item.bottomSpacing}
              link={item.link}
              linkColor={item.linkColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;