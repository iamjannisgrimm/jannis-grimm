import React, { useEffect, useRef, useState } from 'react';
import { TimelineDetail } from './TimelineDetail';
import { timelineDetailData } from '../../data/timeline-detail-data';

const TimelineItem = ({ 
  date, 
  title, 
  subtitle, 
  description, 
  secondDescription, 
  icon, 
  image, 
  techStack, 
  background, 
  topSpacing,
  bottomSpacing,
  link,
  linkColor
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
      }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const topPadding = 70 + (Number(topSpacing) || 0);
  const bottomPadding = 70 + (Number(bottomSpacing) || 0);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: background || "white",
        width: "100vw",
        maxWidth: "100vw",
        paddingTop: `${topPadding}px`,
        paddingBottom: `${bottomPadding}px`,
      }}
    >
      {/* Static timeline line */}
      <div
        style={{
          position: "absolute",
          left: "60px",
          top: "0px",
          width: "4px",
          height: "100%",
          backgroundColor: "gray",
          zIndex: 0,
        }}
      />
      {/* Animated content container */}
      <div
        ref={elementRef}
        style={{
          position: "relative",
          display: "flex",
          gap: "20px",
          paddingLeft: "60px",
          paddingRight: "30px",
          boxSizing: "border-box",
          alignItems: "flex-start",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          willChange: 'opacity, transform'
        }}
      >
        {/* Left column with date and icon */}
        <div
          style={{
            width: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginLeft: "50px",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              color: "gray",
              position: "absolute",
              top: "-50px",
              left: "0",
              textAlign: "left",
              whiteSpace: "nowrap",
              marginLeft: "20px",
              fontFamily: "SF Pro"
            }}
          >
            {date}
          </p>
          {icon && (
            <img
              src={icon}
              alt="icon"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                marginTop: "10px"
              }}
            />
          )}
        </div>
        {/* Right column with content */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: "calc(100% - 150px)",
          padding: "30px",
          marginLeft: "-50px",
          marginTop: "-75px"
        }}>
          <h3 style={{ 
            fontSize: "28px", 
            color: background === "#FFFFFF" ? "black" : "white", 
            marginBottom: "-25px", 
            marginTop: "48px", 
            fontFamily: "SF Pro Regular",
            fontWeight: 800
          }}>
            {title}
          </h3>
          <p style={{ 
            fontSize: "20px", 
            color: background === "#FFFFFF" ? "black" : "white", 
            marginBottom: "24px", 
            fontFamily: "SF Pro Heavy",
            fontWeight: 650
          }}>
            {subtitle}
          </p>
          
          {image && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingRight: "30px",
              }}
            >
              <img
                src={image}
                alt="event"
                style={{
                  maxWidth: "min(650px, 70vw)",
                  minWidth: "400px",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "0px",
                  transition: "width 0.3s ease-in-out",
                  marginLeft: "-80px"
                }}
              />
            </div>
          )}
          
          <div
            style={{
              color: background === "#FFFFFF" ? "black" : "white", 
              textAlign: "left",
              maxWidth: "clamp(300px, 95%, 100% - 50px)",
              padding: "10px 0",
              minWidth: "320px",
              marginLeft: "-80px",
              marginTop: !image ? "-10px" : "15px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontFamily: "SF Pro Bold",
              fontSize: "18px",
              fontWeight: 600
            }}
          >
            <p style={{ margin: 0, fontFamily: "SF Pro Bold" }}>{description}</p>
            {secondDescription && (
              <p style={{ 
                margin: "10px 0 0 0", 
                fontFamily: "SF Pro Bold",
                fontSize: "18px",
                color: background === "#FFFFFF" ? "black" : "white", 
                opacity: 0.9,
                lineHeight: "1.5",
                marginTop: "-10px"
              }}>
                {secondDescription}
              </p>
            )}
            {techStack && techStack.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "15px",
                  marginTop: "5px",
                  marginBottom: "5px"
                }}
              >
                {techStack.map((tech, index) => (
                  <img
                    key={index}
                    src={tech}
                    alt={`tech-${index}`}
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "contain"
                    }}
                  />
                ))}
              </div>
            )}
            {/* For non-"SeeMe" items, render the normal Learn more link if provided */}
            {title !== "SeeMe" && link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: linkColor,
                  textDecoration: "none",
                  paddingBottom: "2px",
                  width: "fit-content",
                  transition: "opacity 0.2s ease",
                  opacity: 0.8,
                  fontFamily: "SF Pro"
                }}
                onMouseOver={(e) => e.target.style.opacity = "1"}
                onMouseOut={(e) => e.target.style.opacity = "0.8"}
              >
                Learn more
              </a>
            )}
          </div>
          
          {/* Expand/Collapse section for TimelineDetail when title is "SeeMe" */}
          {title === "SeeMe" && (
  <div style={{ 
    marginTop: "20px", 
    width: "100%", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "flex-start",
    marginLeft: "-80px" // keeping the container's left offset
  }}>
    <button
      onClick={() => setExpanded(!expanded)}
      style={{
        alignSelf: "flex-start",
        padding: "8px 16px",
        fontSize: "16px",
        backgroundColor: linkColor || "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "SF Pro"
      }}
    >
      {expanded ? "Collapse" : "Learn More"}
    </button>
    <div
      style={{
        overflow: "hidden",
        transition: "max-height 0.5s ease, opacity 0.5s ease",
        maxHeight: expanded ? "10000px" : "0px", // when collapsed, takes up no space
        opacity: expanded ? 1 : 0,
        width: "100%",
        marginTop: "10px"
      }}
    >
      <TimelineDetail data={timelineDetailData} />
      {expanded && link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: linkColor,
            textDecoration: "none",
            paddingBottom: "2px",
            width: "fit-content",
            transition: "opacity 0.2s ease",
            opacity: 0.8,
            fontFamily: "SF Pro",
            // No extra marginLeft here – it now uses the same alignment as the non-SeeMe link
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          Learn more
        </a>
      )}
    </div>
  </div>
)}         
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;