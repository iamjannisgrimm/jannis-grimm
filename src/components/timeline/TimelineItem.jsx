import React, { useEffect, useRef, useState } from 'react';
import { TimelineDetail } from './TimelineDetail';
import { timelineDetailData } from '../../data/timeline-detail-data';

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
      { rootMargin: '0px 0px -50px 0px', threshold: 0.15 }
    );
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, []);

  const lineOffset = screenWidth < 600 ? 20 : screenWidth < 900 ? 40 : 60;
  const sideGap = 20;
  const topPad = 70 + (Number(topSpacing) || 0);
  const botPad = 70 + (Number(bottomSpacing) || 0);

  return (
    <div
      ref={elRef}
      className={`timeline-item${isVisible ? ' visible' : ''}`}
      style={{
        position: 'relative',
        backgroundColor: background || '#fff',
        paddingTop: `${topPad}px`,
        paddingBottom: `${botPad}px`,
        width: '100vw',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity .6s ease, transform .6s ease',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* vertical timeline line */}
      <div
        style={{
          position: 'absolute',
          left: `${lineOffset}px`,
          top: 0,
          width: '4px',
          height: '100%',
          backgroundColor: 'gray',
          zIndex: 0
        }}
      />

      {/* DATE ABOVE EVERYTHING */}
      <div
        style={{
          paddingLeft: `${lineOffset}px`,
          paddingRight: '30px',
          marginBottom: '1.5rem',
          textAlign: 'left',
          marginLeft: '30px'
        }}
      >
        <p style={{ fontSize: '18px', color: 'gray', margin: 0 }}>
          {date}
        </p>
      </div>

      {/* ICON + (VSTACK) TITLE & SUBTITLE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${sideGap}px`,
          paddingLeft: `${lineOffset}px`,
          paddingRight: '30px',
          marginBottom: '1rem',
          marginLeft: '30px',
        }}
      >
        {/* Icon on the left */}
        {icon && (
          <div style={{ flexShrink: 0 }}>
            <img
              src={icon}
              alt=""
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* VStack of title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0rem', flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '36px',
              fontWeight: 800,
              color: background === '#FFFFFF' ? '#000000' : '#FFFFFF',
              textAlign: 'left',
              marginTop: '-15px'

            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 400,
              color: background === '#FFFFFF' ? '#000000' : '#FFFFFF',
              textAlign: 'left'
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* REST OF CONTENT UNCHANGED */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingLeft: `${lineOffset}px`,
          paddingRight: '30px',
          textAlign: 'left',
          marginLeft: '30px'
        }}
      >
{image && (
  <img
    src={image}
    alt=""
    style={{
      width:
        title === "SeeMe" && date.includes("2025")
          ? screenWidth < 900
            ? "100%"
            : "min(1000px, 80vw)"
          : screenWidth < 900
          ? "95%"
          : "min(850px, 70vw)",
      height: "auto",
      borderRadius: "8px",
      marginTop: "10px",
      marginBottom: "10px",
      marginRight: "30px",
    }}
  />
)}
        <p style={{ marginTop: 10, lineHeight: 1, color: background === '#FFFFFF' ? '#000000' : '#FFFFFF'}}>{description}</p>
        {secondDescription && (
          <p style={{ margin: 0, lineHeight: 1.5, opacity: 0.9,color: background === '#FFFFFF' ? '#000000' : '#FFFFFF'
          }}>
            {secondDescription}
          </p>
        )}

        {techStack.length > 0 && (
          <div style={{ display: 'flex', gap: '15px' }}>
            {techStack.map((tech, i) => (
              <img
                key={i}
                src={tech}
                alt=""
                style={{ marginTop: 10, width: '24px', height: '24px' }}
              />
            ))}
          </div>
        )}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.875rem',
            padding: '0rem 0rem',
            fontWeight: 500,
            color: linkColor,
            textDecoration: 'none',
            opacity: 0.8,
            transition: 'opacity 0.2s ease',
            marginTop: 10
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '1')}
          onMouseOut={e => (e.currentTarget.style.opacity = '0.8')}
        >
          Learn more
        </a>
      </div>
    </div>
  );
}