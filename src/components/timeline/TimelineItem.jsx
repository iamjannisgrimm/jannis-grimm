import React, { useEffect, useRef, useState } from "react";
import { TimelineDetail } from "./TimelineDetail";
import { timelineDetailData } from "../../data/timeline-detail-data";

export default function TimelineItem({
  date,
  title,
  subtitle,
  description,
  secondDescription,
  icon,
  image,
  techStack = [],
  background,
  topSpacing = 0,
  bottomSpacing = 0,
  link,
  linkColor
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const elRef = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.15 }
    );
    obs.observe(elRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={elRef}
      className="timeline-item"
      style={{
        backgroundColor: background || "#ffffff",
        paddingTop: `${70 + Number(topSpacing)}px`,
        paddingBottom: `${70 + Number(bottomSpacing)}px`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity .6s ease, transform .6s ease"
      }}
    >
      <div className="timeline-left">
        <p className="timeline-date">{date}</p>
        {icon && <img className="timeline-icon" src={icon} alt="" />}
      </div>
      <div className="timeline-content">
        <h3>{title}</h3>
        <p className="subtitle">{subtitle}</p>
        {image && <img src={image} alt="" />}
        <p className="description">{description}</p>
        {secondDescription && <p className="description">{secondDescription}</p>}
        {techStack.length > 0 && (
          <div className="timeline-techstack">
            {techStack.map((t, i) => (
              <img key={i} src={t} alt="" />
            ))}
          </div>
        )}
        {title !== "SeeMe" && link && (
          <a
            className="timeline-learnmore"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: linkColor }}
          >
            Learn more
          </a>
        )}

        {title === "SeeMe" && (
          <>
            <button
              className="timeline-expand-button"
              onClick={() => setExpanded(x => !x)}
              style={{ backgroundColor: linkColor }}
            >
              {expanded ? "Collapse" : "Learn More"}
            </button>
            <TimelineDetail
              data={timelineDetailData}
              className={expanded ? "timeline-detail open" : "timeline-detail"}
            />
          </>
        )}
      </div>
    </div>
  );
}