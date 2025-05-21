import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const GitHubContributions = ({ username }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [total, setTotal] = useState(null);

  // Helper to sum contributions
  const handleTransformData = (data) => {
    const sum = data.reduce((acc, cur) => acc + (cur.count || 0), 0);
    setTotal(sum);
    return data; // still return the data for rendering!
  };

  useEffect(() => {
    const calculateWidth = () => {
      const viewportWidth = window.innerWidth;
      const maxWidth = Math.min(viewportWidth * 0.9, 800);
      setContainerWidth(maxWidth);
    };
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, []);

  const blockSize = Math.max(containerWidth / 90, 7);
  const blockMargin = Math.max(containerWidth / 250, 2);
  const fontSize = Math.max(containerWidth / 140, 8);

  return (
    <div className="github-contributions" style={{ textAlign: "center" }}>
      <div
        className="github-calendar-container"
        style={{
          maxWidth: `${containerWidth}px`,
          margin: "0 auto",
          display: "inline-block",
          width: "auto",
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
        {total !== null && (
  <div
    style={{
      marginTop: "6px",
      marginBottom: "10px",
      fontSize: "0.98rem",
      color: "#5f6368",
      textAlign: "left",
      fontWeight: 400,
      letterSpacing: "0.01em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.3em"
    }}
  >
    <span style={{ fontSize: "0.8em", opacity: 0.75 }}></span>
    <span style={{
      fontWeight: 800,
      color: "#222",
      fontSize: "0.6em",
      margin: "0 2px"
    }}>
      {total.toLocaleString()}
    </span>
    <span style={{ fontWeight: 400, color: "#888", fontSize: "0.6em" }}>
      contributions in the last year
    </span>
  </div>
)}
      </div>
    </div>
  );
};

export default GitHubContributions;