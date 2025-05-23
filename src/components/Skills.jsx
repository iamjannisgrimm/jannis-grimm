import React, { useRef, useState, useEffect } from 'react';
import { useFadeEffect } from './hooks/useFadeEffect';

/**
 * SkillCategory component that displays a single category of skills
 * with animated bars and true infinite automatic scrolling
 */
const SkillCategory = ({ category, index }) => {
  const containerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef(null);

  // Animation trigger based on when component enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger animation once
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the component is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // True infinite scroll implementation
  useEffect(() => {
    if (!isVisible || !scrollContentRef.current) return;

    // Clone the first set of items and append to create the infinite loop effect
    const setupInfiniteScroll = () => {
      const scrollContent = scrollContentRef.current;
      if (!scrollContent) return;
      
      // Get all direct children (skill items)
      const items = Array.from(scrollContent.children);
      const itemWidth = items[0]?.offsetWidth || 0;
      const gap = 20; // Gap between items from CSS
      
      // Set the animation to run
      let startTime;
      const scrollSpeed = 0.08; // Increased scrolling speed (was 0.04)
      
      const step = (timestamp) => {
        if (isHovering) {
          startTime = timestamp;
          animationRef.current = requestAnimationFrame(step);
          return;
        }
        
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
  }, [isVisible, isHovering]);

  // Create two identical sets of skills for the seamless loop
  const skills = category.items;
  const doubledSkills = [...skills, ...skills];

  return (
    <div className="skill-category">
      <h3 className="skill-category-title">{category.title}</h3>
      <div 
        ref={containerRef}
        className="skills-container"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
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
                      transition: `width 1s cubic-bezier(0.33, 1, 0.68, 1) ${idx % skills.length * 0.1}s`
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
const Skills = ({ skills }) => {
  const [skillsRef, skillsOpacity] = useFadeEffect({ edgeDistance: 100 });

  return (
    <div 
      ref={skillsRef}
      className="skills-wrapper"
      style={{
        opacity: skillsOpacity,
        transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)"
      }}
    >
      {skills.map((category, index) => (
        <SkillCategory 
          key={category.title} 
          category={category} 
          index={index}
        />
      ))}
    </div>
  );
};

export default Skills; 