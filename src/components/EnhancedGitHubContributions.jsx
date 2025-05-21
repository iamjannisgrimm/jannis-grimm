import React, { useState, useEffect, useRef } from "react";
import GitHubCalendar from "react-github-calendar";

const EnhancedGitHubContributions = ({ username }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateDimensions = () => {
      // Check if we're on mobile
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Calculate container width based on parent element or viewport
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement.clientWidth;
        // For desktop, use up to 800px max width
        // For mobile, use 90% of available width
        const maxWidth = mobile ? 
          Math.min(parentWidth * 0.95, 500) : 
          Math.min(parentWidth * 0.9, 800);
        
        setContainerWidth(maxWidth);
      }
    };

    // Initial calculation
    calculateDimensions();
    
    // Recalculate on resize
    window.addEventListener("resize", calculateDimensions);
    
    // Cleanup
    return () => window.removeEventListener("resize", calculateDimensions);
  }, []);

  // Responsive sizing based on container width
  const blockSize = Math.max(containerWidth / (isMobile ? 50 : 90), isMobile ? 8 : 10);
  const blockMargin = Math.max(containerWidth / 250, isMobile ? 1.5 : 2);
  const fontSize = Math.max(containerWidth / 140, isMobile ? 10 : 12);

  // Custom tooltip to handle contribution data
  const renderTooltip = (day) => {
    const date = new Date(day.date);
    const count = day.count;
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return (
      <div className="github-tooltip">
        <strong>{count} contribution{count !== 1 ? 's' : ''}</strong> on {formattedDate}
      </div>
    );
  };

  return (
    <div className="github-contributions" ref={containerRef}>
      <div 
        className={`github-calendar-container ${isMobile ? 'mobile' : 'desktop'}`}
        style={{ maxWidth: `${containerWidth}px` }}
      >
        <GitHubCalendar
          username={username}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={fontSize}
          colorScheme="light"
          renderBlock={(block, activity) => (
            <div 
              className="github-block"
              style={{
                backgroundColor: block.color,
                width: blockSize,
                height: blockSize,
                margin: blockMargin
              }}
              data-count={activity.count}
              data-date={activity.date}
            />
          )}
          tooltipRenderer={renderTooltip}
        />
      </div>
      
      
    </div>
  );
};

export default EnhancedGitHubContributions;