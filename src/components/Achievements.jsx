import React, { useEffect, useRef, useState } from 'react'
import { achievements } from '../data/achievements'

export default function Achievements() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 600 : false
  )
  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const [scrollWidth, setScrollWidth] = useState(0)
  const animationStartTimeRef = useRef(null)
  const currentTransformRef = useRef(0)
  const rafRef = useRef(null)

  // Track mobile/desktop
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener('resize', onResize, { passive: true })
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Always re-measure scrollWidth for accurate animation
  useEffect(() => {
    if (!isMobile) return

    function measureWidth() {
      // Use double requestAnimationFrame for layout to settle (fixes prod jank)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (wrapperRef.current) {
            // Only half the scrollWidth, because we double the items for looping
            setScrollWidth(wrapperRef.current.scrollWidth / 2)
          }
        })
      })
    }

    measureWidth()
    window.addEventListener('resize', measureWidth)
    return () => window.removeEventListener('resize', measureWidth)
  }, [isMobile, achievements.length])

  // Custom animation implementation that won't reset when component visibility changes
  useEffect(() => {
    if (!isMobile || !scrollWidth) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Manual animation to avoid CSS animation resets
    const totalDuration = 12000; // Increased from 12s to 20s for smoother animation with narrower items
    const startTime = performance.now();
    animationStartTimeRef.current = startTime;
    
    const animate = (timestamp) => {
      if (!wrapper) return;
      
      // Calculate elapsed time accounting for animation resumption
      const elapsed = timestamp - animationStartTimeRef.current;
      
      // Calculate the position within the animation cycle
      const position = elapsed % totalDuration;
      
      // Convert position to scroll percentage
      const scrollPercentage = position / totalDuration;
      
      // Calculate the transform value for smooth scrolling
      const transformX = -scrollWidth * scrollPercentage;
      currentTransformRef.current = transformX;
      
      // Apply the transform
      wrapper.style.transform = `translateX(${transformX}px)`;
      
      // Continue animation
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    rafRef.current = requestAnimationFrame(animate);
    
    // Clean up animation on unmount
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMobile, scrollWidth]);

  // Fixed width for all achievement items
  const itemWidth = 100; // Narrower width as requested
  const mobileItemGap = 40; // Gap for mobile view
  const desktopItemGap = 80; // Increased gap for desktop view

  // Each tile
  const itemNodes = achievements.map(({ title, subtitle }, idx) => (
    <div
      key={idx}
      style={{
        flex: '0 0 auto',
        width: `${itemWidth}px`,
        minWidth: `${itemWidth}px`,
        padding: isMobile ? '0.1rem' : '0rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: !isMobile && idx !== 0 ? '-20px' : '0',
      }}
    >
      <h3 style={{
        margin: '0 0 0.25rem',
        fontSize: '1.2rem',
        fontWeight: 800,
        color: '#111827',
        width: "100%", // Use full width of parent
        display: "block",
        textAlign: "center",
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: '0.875rem',
        color: '#555',
        opacity: 0.8,
        lineHeight: 1.3,
        width: "100%", // Use full width of parent
        textAlign: 'center',
        whiteSpace: 'normal', // Allow text wrapping
        wordWrap: 'break-word', // Break long words if needed
        overflow: 'hidden', // Hide overflow
        height: 'auto', // Allow height to adjust to content
      }}>
        {subtitle}
      </p>
    </div>
  ))

  // MOBILE: Double the items for a seamless infinite scroll
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        style={{
          margin: "0 auto",
          fontSize: "0.875rem",
          color: "#555",
          opacity: 0.8,
          lineHeight: 1.3,
          marginTop: '0px',
          marginBottom: '30px',
          width: "100%",
          maxWidth: "100%",
          padding: "0 10px",
          display: "block",
          textAlign: "center",
          overflow: "hidden",
          position: "relative", // For absolute positioning of fade effects
        }}
      >
        {/* Left fade effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "60px",
            background: "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
            zIndex: 2,
            pointerEvents: "none", // Allow clicking through the fade
          }}
        />
        
        <div 
          ref={wrapperRef} 
          style={{ 
            width: '100%', 
            display: 'flex',
            gap: `${mobileItemGap}px`, // Use the mobile gap variable
            willChange: 'transform',
            padding: '0 40px', // Increased padding for edge fade with narrower items
          }}
        >
          {itemNodes}
          {itemNodes}
        </div>
        
        {/* Right fade effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "60px",
            background: "linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
            zIndex: 2,
            pointerEvents: "none", // Allow clicking through the fade
          }}
        />
      </div>
    )
  }

  // DESKTOP: Centered grid as usual
  return (
    <div
      style={{
        width: '100%',
        padding: '1rem 0',
        marginTop: '0px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: `${desktopItemGap}px`, // Use the increased desktop gap variable
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {itemNodes}
      </div>
    </div>
  )
}