import React, { useState, useEffect, Children, cloneElement, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';

/**
 * StagedScroll component for controlled page-by-page scrolling with natural timeline reveal.
 * 
 * Behavior:
 * 1. Users navigate between stages (landing → quotes → skills)
 * 2. Once at skills, any downward scroll exits staged mode to timeline
 * 3. Normal scrolling reveals timeline naturally
 */
const StagedScroll = forwardRef(({ 
  children, 
  onStagedScrollComplete,
  onStageChange,
  chatInputVisible,
  setChatInputVisible,
  fadeColor = "#FFFFFF",
  fadeTime = 0.5,
  initialStage = 0,
  isAnimating,
  setIsAnimating,
  isTransitioning,
  setIsTransitioning
}, ref) => {
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [isComplete, setIsComplete] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollThreshold, setScrollThreshold] = useState(15); // Moderate threshold
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [hasReachedSkills, setHasReachedSkills] = useState(false);
  const [stageReady, setStageReady] = useState(true);
  const [transitionDirection, setTransitionDirection] = useState('down');
  
  // Track accumulated scroll to prevent overshooting
  const accumulatedScrollRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const isScrollEventLockedRef = useRef(false);
  
  const childrenArray = Children.toArray(children);
  const totalStages = childrenArray.length;
  const isAtLastStage = currentStage === totalStages - 1;
  const isAtFirstStage = currentStage === 0;

  // Update current stage when initialStage prop changes
  useEffect(() => {
    setCurrentStage(initialStage);
  }, [initialStage]);
  
  // Track when we've reached the skills stage (last stage)
  useEffect(() => {
    if (isAtLastStage && !hasReachedSkills) {
      // Small delay to ensure animation has completed
      setTimeout(() => {
        setHasReachedSkills(true);
        setStageReady(true);
      }, 150); // Slightly longer delay to ensure stable state
    }
  }, [isAtLastStage, hasReachedSkills]);
  
  // Handle ultra-smooth transition from staged to normal scrolling
  const completeStaging = useCallback(() => {
    // Only allow exit if we've reached the skills stage first and it's ready
    if (!hasReachedSkills || !stageReady || isExiting) return false;
    
    // Start exit transition
    setIsExiting(true);
    
    // Prevent further scroll events
    isScrollEventLockedRef.current = true;
    
    // First notify parent to prepare for transition
    if (onStagedScrollComplete) {
      onStagedScrollComplete();
    }
    
    // Hide chat input when switching to timeline
    if (setChatInputVisible) {
      setChatInputVisible(false);
    }
    
    // Ensure body scrolling is enabled immediately
    document.body.style.overflow = 'auto';
    
    // Create a two-step transition for ultra-smoothness
    requestAnimationFrame(() => {
      // First step: Begin fading out
      document.body.style.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Second step: Wait for fade then unmount
      setTimeout(() => {
        setIsComplete(true);
      }, 350); // Longer fade for smoother transition
    });
    
    return true;
  }, [onStagedScrollComplete, setChatInputVisible, hasReachedSkills, stageReady, isExiting]);
  
  // DEDICATED LANDING PAGE TRANSITION HANDLER
  // Force the landing page to always animate from top to bottom when returning to it
  const LANDING_STAGE_INDEX = 0;
  const QUOTES_STAGE_INDEX = 1;
  const SKILLS_STAGE_INDEX = 2;

  // Add a dedicated function to handle landing page transitions specifically
  const handleLandingPageTransition = (direction) => {
    // Only run this for the up transition from quotes to landing
    if (direction !== 'up' || currentStage !== QUOTES_STAGE_INDEX) return;
    
    // Get the landing page element
    const landingPage = document.querySelector('.stage-0');
    if (!landingPage) return;
    
    // 1. FORCE positioning and state
    // First hide the landing page completely
    landingPage.style.transition = 'none';
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'translateY(-80px)'; // Start well above the viewport
    landingPage.style.visibility = 'visible';
    landingPage.style.filter = 'blur(5px)';
    
    // Force a browser reflow
    void landingPage.offsetHeight;
    
    // 2. APPLY smooth animation with delay to ensure it runs
    setTimeout(() => {
      landingPage.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.9s ease-out, filter 0.9s ease-out';
      landingPage.style.transform = 'translateY(0)';
      landingPage.style.opacity = '1';
      landingPage.style.filter = 'blur(0)';
    }, 50);
  };

  // The stage change function with special handling for landing page
  const goToStage = useCallback((newStage) => {
    if (newStage < 0 || newStage >= totalStages || isScrolling || isExiting) return false;
    
    // Special handling for landing page transition - must happen before state changes
    const isGoingToLanding = newStage === LANDING_STAGE_INDEX;
    const isComingFromQuotes = currentStage === QUOTES_STAGE_INDEX;
    const isUpToLanding = isGoingToLanding && isComingFromQuotes;
    
    // Set transition direction
    const direction = newStage > currentStage ? 'down' : 'up';
    setTransitionDirection(direction);
    
    // If going up to landing page, apply special handling
    if (isUpToLanding) {
      handleLandingPageTransition('up');
    }
    
    // Reset accumulated scroll
    accumulatedScrollRef.current = 0;
    
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    
    // Lock stage to prevent rapid transitions
    setStageReady(false);
    isScrollEventLockedRef.current = true;
    
    // Set animation states
    if (setIsAnimating) setIsAnimating(true);
    if (setIsTransitioning) setIsTransitioning(true);
    setIsScrolling(true);
    
    // Update stage
    setCurrentStage(newStage);
    
    // Clear animation states after transition completes
    const transitionTime = 900; // Longer time for smoother feel
    setTimeout(() => {
      setIsScrolling(false);
      if (setIsAnimating) setIsAnimating(false);
      if (setIsTransitioning) setIsTransitioning(false);
      
      // Re-enable stage interactions after a short delay
      setTimeout(() => {
        setStageReady(true);
        isScrollEventLockedRef.current = false;
      }, 150);
    }, transitionTime);
    
    return true;
  }, [totalStages, isScrolling, setIsAnimating, setIsTransitioning, isExiting, currentStage]);
  
  // Reset scroll accumulator when not actively scrolling
  const resetAccumulatedScroll = useCallback(() => {
    accumulatedScrollRef.current = 0;
    scrollTimeoutRef.current = null;
  }, []);
  
  // Update useImperativeHandle to expose our landing page transition function
  useImperativeHandle(ref, () => ({
    nextStage: () => goToStage(currentStage + 1),
    prevStage: () => {
      // If we're going back to landing, apply our special transition
      if (currentStage === QUOTES_STAGE_INDEX) {
        handleLandingPageTransition('up');
      }
      return goToStage(currentStage - 1);
    },
    completeStaging,
    getCurrentStage: () => currentStage,
    getTotalStages: () => totalStages,
    setStage: (stage) => {
      // When manually setting to skills stage, mark as reached
      if (stage === totalStages - 1) {
        setHasReachedSkills(true);
      }
      
      // If we're setting to landing from quotes, apply special transition
      if (stage === LANDING_STAGE_INDEX && currentStage === QUOTES_STAGE_INDEX) {
        handleLandingPageTransition('up');
      }
      
      // Set transition direction based on requested stage
      setTransitionDirection(stage > currentStage ? 'down' : 'up');
      return goToStage(stage);
    },
    forceSkillsTransition: () => {
      setHasReachedSkills(true);
      setStageReady(true);
      setIsComplete(false);
      setIsExiting(false);
      document.body.style.overflow = 'hidden';
      return goToStage(totalStages - 1);
    },
    // Expose landing page transition directly
    handleLandingPageTransition
  }), [currentStage, totalStages, goToStage, completeStaging, hasReachedSkills, handleLandingPageTransition]);
  
  // Control body scrolling
  useEffect(() => {
    if (!isComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isComplete]);

  // Report stage changes to parent
  useEffect(() => {
    if (onStageChange) {
      onStageChange(currentStage);
    }
    
    // Keep chat input visible during staged scrolling
    if (setChatInputVisible) {
      setChatInputVisible(true);
    }
  }, [currentStage, onStageChange, setChatInputVisible]);
  
  // Adjust scroll threshold for touch devices
  useEffect(() => {
    if ('ontouchstart' in window) {
      setScrollThreshold(20);
    }
  }, []);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle wheel event for scrolling between stages
  useEffect(() => {
    const handleScroll = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      // Get current time for cooldown
      const now = Date.now();
      if (now - lastScrollTime < 250) return; // Slightly longer cooldown for smoother feel
      setLastScrollTime(now);
      
      // Accumulate scroll deltas to handle fast scrolling
      accumulatedScrollRef.current += e.deltaY;
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set a timeout to process the accumulated scroll
      scrollTimeoutRef.current = setTimeout(() => {
        const accScroll = accumulatedScrollRef.current;
        
        // Set the direction for animation
        const direction = accScroll > 0 ? 'down' : 'up';
        setTransitionDirection(direction);
        
        // Special case for landing page transition
        const isGoingUpToLanding = direction === 'up' && currentStage === QUOTES_STAGE_INDEX && accScroll < -scrollThreshold;
        if (isGoingUpToLanding) {
          handleLandingPageTransition('up');
        }
        
        // At skills section (last stage)
        if (isAtLastStage) {
          if (accScroll > scrollThreshold) {
            // Any downward scroll at skills exits staged mode immediately
            // But only if we've actually reached this stage before
            if (hasReachedSkills) {
              completeStaging();
            }
          } else if (accScroll < -scrollThreshold) {
            // Scrolling up goes to previous stage with threshold
            goToStage(currentStage - 1);
          }
        } else {
          // Normal stage navigation with threshold
          if (accScroll > scrollThreshold) {
            // Directly go to skills if a long scroll is detected from quotes
            if (currentStage === 1 && accScroll > scrollThreshold * 3) {
              goToStage(2); // Go straight to skills (stage index 2)
            } else {
              // Regular next stage
              goToStage(currentStage + 1);
            }
          } else if (accScroll < -scrollThreshold && currentStage > 0) {
            // Handle fast upward scroll - go directly to landing page if needed
            if (currentStage === 1 && accScroll < -scrollThreshold * 3) {
              goToStage(0); // Go straight to landing (stage index 0)
            } else {
              // Regular previous stage
              goToStage(currentStage - 1);
            }
          }
        }
        
        // Reset accumulated scroll
        resetAccumulatedScroll();
      }, 50); // Short delay to accumulate fast scrolling
    };
    
    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [
    currentStage, 
    isComplete, 
    isScrolling, 
    completeStaging, 
    scrollThreshold, 
    lastScrollTime,
    isAtLastStage,
    goToStage,
    isExiting,
    hasReachedSkills,
    stageReady,
    resetAccumulatedScroll,
    handleLandingPageTransition
  ]);
  
  // Handle touch events with improved control
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;
    
    const handleTouchStart = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      
      // Reset accumulated scroll on new touch
      accumulatedScrollRef.current = 0;
    };
    
    const handleTouchMove = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      // Accumulate touch move distance
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      accumulatedScrollRef.current = deltaY;
    };
    
    const handleTouchEnd = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      // Get current time for cooldown
      const now = Date.now();
      if (now - lastScrollTime < 250) return; // Slightly longer cooldown for smoother feel
      setLastScrollTime(now);
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      // Calculate velocity for detecting fast swipes
      const touchDuration = now - touchStartTime;
      const velocity = Math.abs(deltaY) / touchDuration;
      const isFastSwipe = velocity > 0.8; // Threshold for fast swipe
      
      // Set the direction for animation
      setTransitionDirection(deltaY > 0 ? 'down' : 'up');
      
      // At skills section (last stage)
      if (isAtLastStage) {
        if (deltaY > scrollThreshold) {
          // Any downward swipe at skills exits staged mode
          // But only if we've actually reached this stage before
          if (hasReachedSkills) {
            completeStaging();
          }
        } else if (deltaY < -scrollThreshold) {
          // Swiping up goes to previous stage with threshold
          goToStage(currentStage - 1);
        }
      } else {
        // Skip if swipe is below threshold
        if (Math.abs(deltaY) < scrollThreshold && !isFastSwipe) return;
        
        // Normal stage navigation with fast swipe detection
        if (deltaY > 0) {
          // Direct to skills for fast/long downward swipes from quotes
          if (currentStage === 1 && (isFastSwipe || deltaY > scrollThreshold * 3)) {
            goToStage(2); // Go straight to skills (stage index 2)
          } else {
            // Regular next stage
            goToStage(currentStage + 1);
          }
        } else if (deltaY < 0 && currentStage > 0) {
          // Direct to landing for fast/long upward swipes from quotes
          if (currentStage === 1 && (isFastSwipe || deltaY < -scrollThreshold * 3)) {
            goToStage(0); // Go straight to landing (stage index 0)
          } else {
            // Regular previous stage
            goToStage(currentStage - 1);
          }
        }
      }
      
      // Reset accumulated scroll
      resetAccumulatedScroll();
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    currentStage, 
    isComplete, 
    isScrolling, 
    completeStaging, 
    scrollThreshold, 
    lastScrollTime,
    isAtLastStage,
    goToStage,
    isExiting,
    hasReachedSkills,
    stageReady,
    resetAccumulatedScroll
  ]);

  // Get stage-specific transition animations with ultra-smooth easing
  const getStageTransition = (index) => {
    // Refined easing curve for smoother motion - more elegant ease-out
    const smoothEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // Longer durations for smoother transitions
    const landingTransition = `opacity 0.9s ${smoothEasing}, transform 0.9s ${smoothEasing}, filter 0.9s ${smoothEasing}`;
    const regularTransition = `opacity 0.85s ${smoothEasing}, transform 0.85s ${smoothEasing}, filter 0.85s ${smoothEasing}`;
    
    // Landing page gets special transition
    if (index === 0) {
      return landingTransition;
    } 
    // Other sections use standard transitions
    else {
      return regularTransition;
    }
  };
  
  // Completely simplify landing page styles - transitions handled by JS for special cases
  const getLandingPageStyle = () => {
    const isActive = currentStage === LANDING_STAGE_INDEX;
    const isPrev = currentStage === LANDING_STAGE_INDEX + 1;
    const isInitialLoad = isActive && !isScrolling && !isExiting && initialStage === LANDING_STAGE_INDEX;
    
    // Common styles
    const baseStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: 'transform, opacity, filter',
      transformStyle: 'preserve-3d',
      transition: getStageTransition(0)
    };

    // When landing page is active
    if (isActive) {
      return {
        ...baseStyles,
        opacity: 1,
        visibility: 'visible',
        transform: 'translateY(0)',
        filter: 'blur(0)',
        animation: isInitialLoad ? 'landingEnter 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      };
    } 
    // When landing page is the previous section (scrolling down)
    else if (isPrev && transitionDirection === 'down') {
      return {
        ...baseStyles,
        opacity: 0,
        visibility: 'visible',
        transform: 'translateY(-100px)',
        filter: 'blur(5px)',
      };
    } 
    // When coming back to landing (scrolling up) - just position it
    else if (currentStage === QUOTES_STAGE_INDEX && transitionDirection === 'up') {
      return {
        ...baseStyles,
        // Let the handleLandingPageTransition function control visibility
        visibility: 'visible'
      };
    }
    // For all other cases
    else {
      return {
        ...baseStyles,
        opacity: 0,
        visibility: 'hidden',
        transform: transitionDirection === 'down' ? 'translateY(-100px)' : 'translateY(100px)',
        filter: 'blur(5px)',
      };
    }
  };
  
  // Get stage-specific transform effects with smoother movements
  const getStageTransform = (index) => {
    const isCurrentStage = index === currentStage;
    const isNextStage = index === currentStage + 1;
    const isPrevStage = index === currentStage - 1;
    
    // Active stage - perfectly centered
    if (isCurrentStage) {
      return 'translateY(0)';
    }
    
    // When scrolling down
    if (transitionDirection === 'down') {
      // Previous sections move up and out
      if (index < currentStage) {
        // Landing page moves up and out of view
        return 'translateY(-100px)';
      } 
      // Next section waits below
      else if (isNextStage) {
        return 'translateY(100px)';
      }
      // Further sections wait further below
      else {
        return 'translateY(200px)';
      }
    } 
    // When scrolling up
    else {
      // Future sections move down and out
      if (index > currentStage) {
        return 'translateY(100px)';
      } 
      // Previous section waits above
      else if (isPrevStage) {
        return 'translateY(-100px)';
      }
      // Further past sections wait further above
      else {
        return 'translateY(-200px)';
      }
    }
  };
  
  // Get additional style effects for scroll-like transitions
  const getStageEffects = (index) => {
    const isCurrentStage = index === currentStage;
    
    // All stages get blurred and fade when not active
    return {
      opacity: isCurrentStage ? 1 : 0,
      filter: isCurrentStage ? 'blur(0)' : 'blur(5px)',
      visibility: isCurrentStage ? 'visible' : 'visible', // Keep visible for transitions
    };
  };
  
  // Once complete, don't render anything
  if (isComplete) {
    return null;
  }
  
  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh', 
        backgroundColor: fadeColor,
        zIndex: 5,
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isExiting ? 'none' : 'auto',
        willChange: 'opacity',
        overflow: 'hidden'
      }}
    >
      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes landingEnter {
            0% { opacity: 0; transform: translateY(60px); filter: blur(3px); }
            50% { opacity: 0.8; transform: translateY(-8px); filter: blur(1px); }
            75% { transform: translateY(3px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          
          @keyframes pulseIndicator {
            0% { opacity: 0.5; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
            100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
          }
          
          @keyframes bounceArrow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
        `}
      </style>

      {/* Landing page with special animation handling */}
      <div
        key="landing-page"
        className={`stage-section stage-0 ${currentStage === 0 ? 'active' : ''} ${transitionDirection}`}
        style={{
          ...getLandingPageStyle(),
          ...getStageEffects(0)
        }}
        id="landing-stage"
      >
        {cloneElement(childrenArray[0], {
          isActive: currentStage === 0,
          stageIndex: 0,
          totalStages,
          transitionDirection
        })}
      </div>
      
      {/* Other pages with scroll-like transitions */}
      {childrenArray.slice(1).map((child, idx) => {
        const index = idx + 1; // Offset by 1 since we handled landing page separately
        const isActive = index === currentStage;
        
        return (
          <div 
            key={index}
            className={`stage-section stage-${index} ${isActive ? 'active' : ''} ${transitionDirection}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform, opacity, filter',
              transform: getStageTransform(index),
              transition: getStageTransition(index),
              ...getStageEffects(index),
              transformStyle: 'preserve-3d',
            }}
          >
            {cloneElement(child, {
              isActive,
              stageIndex: index,
              totalStages,
              transitionDirection
            })}
          </div>
        );
      })}
      
      {/* Scroll indicator - only show for non-final stages */}
      {!isAtLastStage && (
        <div 
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: 0.6,
            fontSize: '14px',
            color: '#555',
            transition: 'opacity 0.4s cubic-bezier(0.2, 0, 0.2, 1), transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
            pointerEvents: 'none',
            animation: 'pulseIndicator 2.5s infinite ease-in-out'
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            Scroll to continue
          </div>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'bounceArrow 1.8s infinite ease-in-out'
            }}
          >
            <path d="M7 10L12 15L17 10" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
});

export default StagedScroll; 