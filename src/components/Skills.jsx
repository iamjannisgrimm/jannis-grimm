import React, { useRef, useState, useEffect } from 'react';
import { useFadeEffect } from './hooks/useFadeEffect';
import { useIsVisible } from './hooks/useIsVisible';

/**
 * SkillCategory component that displays a single category of skills
 * with animated bars and true infinite automatic scrolling
 */
const SkillCategory = ({ category, index, isVisible, stageMode }) => {
  const containerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const [categoryRef, categoryOpacity] = useFadeEffect({
    topEdgeDistance: 100,
    bottomEdgeDistance: 200,
    fadeTop: true,
    fadeBottom: true
  });
  
  const animationRef = useRef(null);

  // Animation trigger based on when component enters viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Trigger animations when the isVisible prop is true
    // No need for additional IntersectionObserver here
  }, [isVisible]);

  // True infinite scroll implementation
  useEffect(() => {
    if (!isVisible || !scrollContentRef.current) return;

    // Clone the first set of items and append to create the infinite loop effect
    const setupInfiniteScroll = () => {
      const scrollContent = scrollContentRef.current;
      if (!scrollContent) return;
      
      // Set the animation to run
      let startTime;
      const scrollSpeed = 0.08; // Increased scrolling speed (was 0.04)
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Calculate the scrollLeft position
        const position = (elapsed * scrollSpeed) % (scrollContent.scrollWidth / 2);
        
        // Apply the scroll position
        if (scrollContent.parentElement) {
          scrollContent.parentElement.scrollLeft = position;
          
          // When we're near the halfway point, reset to start to create perfect loop
          if (position > (scrollContent.scrollWidth / 2) - 10) {
            startTime = timestamp;
          }
        }
        
        animationRef.current = requestAnimationFrame(step);
      };
      
      animationRef.current = requestAnimationFrame(step);
    };
    
    setupInfiniteScroll();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  // Create two identical sets of skills for the seamless loop
  const skills = category.items;
  const doubledSkills = [...skills, ...skills];
  
  // Generate gradient for skill bars using the category color
  const gradientStyle = {
    background: `linear-gradient(90deg, ${category.color} 0%, ${adjustColorBrightness(category.color, 30)} 100%)`
  };
  
  // Helper function to adjust color brightness for gradient
  function adjustColorBrightness(hex, percent) {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Increase brightness
    r = Math.min(255, r + (percent / 100) * 255);
    g = Math.min(255, g + (percent / 100) * 255);
    b = Math.min(255, b + (percent / 100) * 255);
    
    // Convert back to hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }

  return (
    <div 
      ref={categoryRef} 
      className="skill-category"
      style={{
        opacity: categoryOpacity,
        transition: "opacity 0.3s cubic-bezier(0.33,1,0.68,1)",
        margin: stageMode ? "10px auto" : "inherit",
        marginBottom: stageMode ? "20px" : "inherit"
      }}
    >
      <h3 className="skill-category-title">{category.title}</h3>
      <div 
        ref={containerRef}
        className="skills-container"
      >
        <div className="skills-scroll-container">
          <div 
            ref={scrollContentRef}
            className="skills-row"
          >
            {doubledSkills.map((skill, idx) => (
              <div key={`${skill.name}-${idx}`} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar-container">
                  <div 
                    className="skill-bar" 
                    style={{ 
                      width: isVisible ? `${skill.level}%` : '0%',
                      transition: `width 1s cubic-bezier(0.33, 1, 0.68, 1) ${idx % skills.length * 0.1}s`,
                      ...gradientStyle
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skills component that displays multiple categories of skills
 */
export default function Skills({ skills, stageMode = false }) {
  // Look for the isVisible ref to control whether animation runs
  const containerRef = useRef(null);
  const isVisible = useIsVisible(containerRef);

  return (
    <div 
      className="skills-wrapper" 
      ref={containerRef}
      style={{
        margin: stageMode ? "0 auto" : "40px auto",
        marginBottom: stageMode ? 0 : "80px",
        gap: stageMode ? "15px" : "15px"
      }}
    >
      {skills.map((category, index) => (
        <SkillCategory 
          key={category.name || index} 
          category={category} 
          index={index}
          isVisible={isVisible}
          stageMode={stageMode}
        />
      ))}
    </div>
  );
} 