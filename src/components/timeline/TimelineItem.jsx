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
      {/* timeline line */}
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

      {/* header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: `${sideGap}px`,
          marginBottom: '1rem',
          paddingLeft: `${lineOffset}px`,
          paddingRight: '30px',
          textAlign: 'left'
        }}
      >
        {/* date + icon */}
        <div
          style={{
            width: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
            textAlign: 'center'
          }}
        >
          <p style={{ fontSize: '18px', color: 'gray', margin: 0 }}>
            {date}
          </p>
          {icon && (
            <img
              src={icon}
              alt=""
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
          )}
        </div>

        {/* title + subtitle */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 600,
              color: background === '#fff' ? '#000' : '#fff',
              textAlign: 'left'
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 400,
              color: background === '#fff' ? '#000' : '#fff',
              textAlign: 'left'
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingLeft: `${lineOffset}px`,
          paddingRight: '30px',
          textAlign: 'left'
        }}
      >
        {image && (
          <img
            src={image}
            alt=""
            style={{
              width: screenWidth < 900 ? '100%' : 'min(950px, 70vw)',
              height: 'auto',
              borderRadius: '8px',
              margin: screenWidth >= 900 ? '0 30px' : '0'
            }}
          />
        )}

        <p style={{ margin: 0, lineHeight: 1.5 }}>{description}</p>
        {secondDescription && (
          <p style={{ margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
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
                style={{ width: '24px', height: '24px' }}
              />
            ))}
          </div>
        )}

        {title !== 'SeeMe' && link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.875rem',
              padding: '0.25rem 0.5rem',
              fontWeight: 500,
              color: linkColor,
              textDecoration: 'none',
              opacity: 0.8,
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
          >
            Learn more
          </a>
        )}

        {title === 'SeeMe' && (
          <>
            <button
              onClick={() => setExpanded((e) => !e)}
              style={{
                fontSize: '0.875rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: linkColor,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              {expanded ? 'Collapse' : 'Learn More'}
            </button>
            <div
              style={{
                overflow: 'hidden',
                transition: 'max-height 0.5s ease, opacity 0.5s ease',
                maxHeight: expanded ? '1000px' : '0',
                opacity: expanded ? 1 : 0
              }}
            >
              <TimelineDetail data={timelineDetailData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}