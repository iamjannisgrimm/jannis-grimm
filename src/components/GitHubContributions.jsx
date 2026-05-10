import React, { useCallback, useEffect, useRef, useState } from "react";
import GitHubCalendar from "react-github-calendar";

const GitHubContributions = ({ username, onTotalContributionsChange }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const reportedTotalRef = useRef(null);

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
  const transformContributionData = useCallback((data) => {
    const total = data.reduce((sum, day) => sum + day.count, 0);

    if (reportedTotalRef.current !== total) {
      reportedTotalRef.current = total;
      window.setTimeout(() => onTotalContributionsChange?.(total), 0);
    }

    return data;
  }, [onTotalContributionsChange]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        margin: 0,
        marginBottom: "-22px",
        padding: 0,
        marginTop: "0px"
      }}
    >
      <style>
        {`
          .react-activity-calendar text {
            fill: black !important;
            font-weight: bold;
          }
          .react-activity-calendar {
            color: black !important;
            max-width: 100%;
            margin: 0 auto;
          }
          .react-activity-calendar span,
          .react-activity-calendar summary,
          .react-activity-calendar button {
            color: black !important;
          }
          @media (max-width: 800px) {
            .react-activity-calendar {
              overflow-x: auto;
            }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          maxWidth: `${containerWidth}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "auto",
          margin: "0 auto",
          padding: 0
        }}
      >
        <GitHubCalendar
          username={username}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={fontSize}
          colorScheme="light"
          transformData={transformContributionData}
          transformTotalCount={false}
        />
      </div>
    </div>
  );
};

export default GitHubContributions;
