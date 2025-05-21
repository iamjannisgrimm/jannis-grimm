import React, { useState, useEffect, useRef } from "react";
import GitHubCalendar from "react-github-calendar";

const GitHubContributions = ({ username }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [total, setTotal] = useState(null);
  const containerRef = useRef(null);

  const handleTransformData = (data) => {
    const sum = data.reduce((acc, cur) => acc + (cur.count || 0), 0);
    setTotal(sum);
    return data;
  };

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  useEffect(() => {
    const calculateWidth = () => {
      const viewportWidth = window.innerWidth;
      const maxWidth = Math.min(viewportWidth * 0.9, 800);
      setContainerWidth(maxWidth);
      setIsMobile(viewportWidth <= 600);
    };
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, []);

  // Force scroll all the way to the right after SVG is rendered on mobile
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    function scrollRight() {
      const scrollDiv = containerRef.current;
      // Find SVG (should have this class from react-activity-calendar)
      const svg = scrollDiv.querySelector('.react-activity-calendar__calendar');
      if (svg) {
        if (svg.scrollWidth > scrollDiv.clientWidth) {
          scrollDiv.scrollLeft = svg.scrollWidth - scrollDiv.clientWidth;
        }
      } else {
        setTimeout(scrollRight, 80); // Try again if not ready yet
      }
    }
    setTimeout(scrollRight, 120);
  }, [isMobile, containerWidth, total]);

  const blockSize = Math.max(containerWidth / 90, 7);
  const blockMargin = Math.max(containerWidth / 250, 2);
  const fontSize = Math.max(containerWidth / 140, 8);

  return (
    <div className="github-contributions" style={{
      textAlign: "center",
      width: "100%",
      maxWidth: 800,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Calendar is scrollable on mobile */}
      <div
        ref={containerRef}
        className="github-calendar-container"
        style={{
          maxWidth: `${containerWidth}px`,
          margin: "0 auto",
          display: "inline-block",
          width: isMobile ? "100vw" : "auto",
          minWidth: 0,
          overflowX: isMobile ? "auto" : "visible",
          verticalAlign: "top",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <GitHubCalendar
          username={username}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={fontSize}
          colorScheme="light"
          hideTotalCount={true}
          hideColorLegend={true}
          transformData={handleTransformData}
        />
      </div>
      {/* This part is NOT inside the scroll view! */}
      {total !== null && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "0.98rem",
            color: "#5f6368",
            textAlign: "center",
            fontWeight: 400,
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3em",
            width: "100%",
            maxWidth: containerWidth,
          }}
        >
          <span style={{ fontWeight: 800, color: "#222", fontSize: "0.62em" }}>
            {total.toLocaleString()}
          </span>
          <span style={{ fontWeight: 400, color: "#888", fontSize: "0.62em" }}>
            contributions in the last year
          </span>
        </div>
      )}
    </div>
  );
};

export default GitHubContributions;