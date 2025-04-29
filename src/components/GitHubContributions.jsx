import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const GitHubContributions = ({ username }) => {
  const [containerWidth, setContainerWidth] = useState(0);

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
    <div className="github-contributions">
      <div
        className="github-calendar-container"
        style={{ maxWidth: `${containerWidth}px` }}
      >
        <GitHubCalendar
          username={username}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={fontSize}
          colorScheme="light"
        />
      </div>
    </div>
  );
};

export default GitHubContributions;