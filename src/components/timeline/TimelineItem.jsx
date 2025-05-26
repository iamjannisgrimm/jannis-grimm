import React, { useState, useEffect, useRef } from 'react';

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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const elRef = useRef(null);

  // track resize
  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // intersection observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '0px 0px -100px 0px', threshold: 0.1 }
    );
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, []);

  const sideGap = 20;
  const topPad = 70 + (Number(topSpacing) || 0);
  const botPad = 70 + (Number(bottomSpacing) || 0);
  
  // Define max content width for better centering
  const contentMaxWidth = screenWidth < 600 ? '90%' : screenWidth < 900 ? '85%' : '80%';

  // Determine text color based on background
  const textColor = background === '#FFFFFF' ? '#000000' : '#FFFFFF';

  return (
    <div
      ref={elRef}
      className={`timeline-item${isVisible ? ' visible' : ''}`}
      style={{
        backgroundColor: background || '#fff',
        paddingTop: `${topPad}px`,
        paddingBottom: `${botPad}px`,
        width: '100vw',
        fontFamily: 'SF Pro Display, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <div className="timeline-item-content" style={{ width: contentMaxWidth, margin: '0 auto' }}>
        {/* DATE ABOVE EVERYTHING */}
        <div
          className="timeline-date-container"
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}
        >
          <p style={{ fontSize: '18px', color: 'gray', margin: 0 }}>
            {date}
          </p>
        </div>

        {/* ICON + (VSTACK) TITLE & SUBTITLE */}
        <div
          className="timeline-header-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${sideGap}px`,
            marginBottom: '1.5rem'
          }}
        >
          {/* Icon */}
          {icon && (
            <div className="timeline-icon-container" style={{ marginBottom: '1rem' }}>
              <img
                src={icon}
                alt=""
                className="timeline-icon"
                style={{
                  width: '70px',
                  height: '70px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}

          {/* VStack of title + subtitle */}
          <div className="timeline-title-container" style={{ textAlign: 'center', width: '100%' }}>
            <h3
              className="timeline-item-title"
              style={{
                margin: 0,
                fontSize: '36px',
                fontWeight: 800,
                color: textColor
              }}
            >
              {title}
            </h3>
            <p
              className="timeline-item-subtitle"
              style={{
                margin: 0,
                marginTop: '0.5rem',
                fontSize: '20px',
                fontWeight: 400,
                color: textColor
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* CONTENT - Image, Description, Tech Stack */}
        <div
          className="timeline-content-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          {image && (
            <img
              src={image}
              alt=""
              className="timeline-image"
              style={{
                width: title === "SeeMe" && date.includes("2025")
                  ? screenWidth < 900 ? "100%" : "min(1000px, 80vw)"
                  : screenWidth < 900 ? "95%" : "min(850px, 70vw)",
                height: "auto",
                borderRadius: "8px",
                marginTop: "10px",
                marginBottom: "10px"
              }}
            />
          )}
          
          <p className="timeline-description" style={{ 
            textAlign: 'center', 
            maxWidth: '800px', 
            lineHeight: 1.5, 
            color: textColor
          }}>
            {description}
          </p>
          
          {secondDescription && (
            <p className="timeline-secondary-description" style={{ 
              textAlign: 'center', 
              maxWidth: '800px', 
              lineHeight: 1.5, 
              opacity: 0.9, 
              color: textColor
            }}>
              {secondDescription}
            </p>
          )}

          {techStack.length > 0 && (
            <div className="timeline-tech-stack" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
              {techStack.map((tech, i) => (
                <img
                  key={i}
                  src={tech}
                  alt=""
                  className="tech-icon"
                  style={{ width: '28px', height: '28px' }}
                />
              ))}
            </div>
          )}
          
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="timeline-link"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                fontWeight: 500,
                color: linkColor,
                textDecoration: 'none',
                opacity: 0.8,
                transition: 'all 0.3s ease',
                marginTop: '10px',
                borderRadius: '4px',
                border: `1px solid ${linkColor}`,
                display: 'inline-block'
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '1', e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={e => (e.currentTarget.style.opacity = '0.8', e.currentTarget.style.transform = 'scale(1)')}
            >
              Learn more
            </a>
          )}
        </div>
      </div>
    </div>
  );
}