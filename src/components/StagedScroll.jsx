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
  
  // Add mobile detection state - MOVED UP before it's used
  const [isMobile, setIsMobile] = useState(false);
  
  // Track accumulated scroll to prevent overshooting
  const accumulatedScrollRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const isScrollEventLockedRef = useRef(false);
  
  const childrenArray = Children.toArray(children);
  const totalStages = childrenArray.length;
  const isAtLastStage = currentStage === totalStages - 1;
  const isAtFirstStage = currentStage === 0;

  // Create memoized values for stage indices that update when isMobile changes
  const stageIndices = React.useMemo(() => {
    return {
      LANDING_STAGE_INDEX: 0,
      ACHIEVEMENTS_STAGE_INDEX: 1,
      QUOTES_STAGE_INDEX: isMobile ? 2 : 1,
      SKILLS_STAGE_INDEX: isMobile ? 3 : 2
    };
  }, [isMobile]);

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
  
  // Update useEffect to detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update stage indices based on mobile vs desktop
  useEffect(() => {
    // Only needed if the current stage might need adjusting after resize
    if (isMobile && currentStage > 0) {
      // Handle edge case when switching between mobile/desktop modes
    }
  }, [isMobile]);
  
  // Completely rewrite the completeStaging function for ultra-smooth transition
  const completeStaging = useCallback(() => {
    // Don't run if already exiting
    if (isExiting) return false;
    
    console.log("Starting smooth transition to timeline");
    
    // Start exit transition
    setIsExiting(true);
    
    // Prevent further scroll events during transition
    isScrollEventLockedRef.current = true;
    
    // First notify parent to prepare the timeline content
    if (onStagedScrollComplete) {
      onStagedScrollComplete();
    }
    
    // Hide chat input when switching to timeline
    if (setChatInputVisible) {
      setChatInputVisible(false);
    }
    
    // CRITICAL: New approach - show the content first, then remove staged scroll
    document.body.style.overflow = 'hidden'; // Still prevent scrolling temporarily
    
    // First step: Prepare and position the timeline correctly
    requestAnimationFrame(() => {
      // IMPORTANT: Pre-position timeline content at the very top
      window.scrollTo(0, 0);
      
      // Create ultra-smooth transition with sequential steps
      // Use different timing for mobile vs. desktop
      if (isMobile) {
        // Original mobile behavior with slightly longer timing
        setTimeout(() => {
          // 1. Fade out the staged scroll container
          const stagedContainer = document.querySelector('[data-staged-scroll-container]');
          if (stagedContainer) {
            stagedContainer.style.opacity = '0';
            stagedContainer.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          }
          
          // 2. After fade out begins, enable normal scrolling with timeline now visible
          setTimeout(() => {
            console.log("Enabling natural scrolling");
            document.body.style.overflow = 'auto';
            
            // 3. Finally, after a longer delay, fully remove the staged scroll component
            setTimeout(() => {
              console.log("Removing staged scroll component");
              setIsComplete(true);
            }, 400); // Original delay before fully removing component
          }, 150); // Original delay before enabling scroll
        }, 50); // Original delay for consistent behavior
      } else {
        // Optimized desktop behavior
        requestAnimationFrame(() => {
          // 1. Fade out the staged scroll container
          const stagedContainer = document.querySelector('[data-staged-scroll-container]');
          if (stagedContainer) {
            stagedContainer.style.opacity = '0';
            stagedContainer.style.willChange = 'opacity';
            stagedContainer.style.transition = 'opacity 0.4s cubic-bezier(0.33, 1, 0.68, 1)';
          }
          
          // 2. After fade out begins, enable normal scrolling with timeline now visible
          setTimeout(() => {
            console.log("Enabling natural scrolling");
            document.body.style.overflow = 'auto';
            
            // 3. Finally, after a longer delay, fully remove the staged scroll component
            setTimeout(() => {
              console.log("Removing staged scroll component");
              setIsComplete(true);
            }, 300); // Shorter delay before fully removing component
          }, 100); // Shorter delay before enabling scroll
        });
      }
    });
    
    return true;
  }, [onStagedScrollComplete, setChatInputVisible, isExiting, isMobile]);
  
  // Fix circular dependency by reorganizing the callbacks
  // First, define handleLandingPageTransition as a regular function
  const handleLandingPageTransition = (direction) => {
    // For mobile: coming from achievements page (index 1)
    // For desktop: coming from quotes page (index 1)
    const sourceIndex = isMobile ? stageIndices.ACHIEVEMENTS_STAGE_INDEX : stageIndices.QUOTES_STAGE_INDEX;
    
    // Only run this for the up transition from the appropriate section to landing
    if (direction !== 'up' || currentStage !== sourceIndex) return;
    
    // Get the landing page element
    const landingPage = document.querySelector('.stage-0');
    if (!landingPage) return;
    
    if (isMobile) {
      // Original mobile behavior
      landingPage.style.transition = 'none';
      landingPage.style.opacity = '0';
      landingPage.style.transform = 'translateY(-80px)';
      landingPage.style.visibility = 'visible';
      landingPage.style.filter = 'blur(5px)';
      
      // Force reflow
      void landingPage.offsetHeight;
      
      // Apply smooth animation with delay - original timing for mobile
      setTimeout(() => {
        landingPage.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.9s ease-out, filter 0.9s ease-out';
        landingPage.style.transform = 'translateY(0)';
        landingPage.style.opacity = '1';
        landingPage.style.filter = 'blur(0)';
      }, 50);
    } else {
      // Optimized desktop behavior
      landingPage.style.transition = 'none';
      landingPage.style.opacity = '0';
      landingPage.style.transform = 'translate3d(0, -70px, 0)';
      landingPage.style.visibility = 'visible';
      landingPage.style.filter = 'blur(4px)';
      landingPage.style.willChange = 'transform, opacity';
      landingPage.style.backfaceVisibility = 'hidden';
      landingPage.style.perspective = '1000';
      
      // Force reflow
      void landingPage.offsetHeight;
      
      // Apply smooth animation with delay - optimized for desktop
      requestAnimationFrame(() => {
        landingPage.style.transition = 'transform 0.65s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.65s cubic-bezier(0.33, 1, 0.68, 1), filter 0.65s cubic-bezier(0.33, 1, 0.68, 1)';
        landingPage.style.transform = 'translate3d(0, 0, 0)';
        landingPage.style.opacity = '1';
        landingPage.style.filter = 'blur(0)';
      });
    }
  };

  // Then define goToStage without the circular dependency
  const goToStage = useCallback((newStage) => {
    if (newStage < 0 || newStage >= totalStages || isScrolling || isExiting) return false;
    
    // Special handling for landing page transition
    const isGoingToLanding = newStage === stageIndices.LANDING_STAGE_INDEX;
    const sourceIndex = isMobile ? stageIndices.ACHIEVEMENTS_STAGE_INDEX : stageIndices.QUOTES_STAGE_INDEX;
    const isComingFromSource = currentStage === sourceIndex;
    const isUpToLanding = isGoingToLanding && isComingFromSource;
    
    // Set transition direction
    const direction = newStage > currentStage ? 'down' : 'up';
    setTransitionDirection(direction);
    
    // Apply landing page special transition if needed
    if (isUpToLanding) {
      handleLandingPageTransition('up');
    }
    
    // Rest of the function remains the same
    accumulatedScrollRef.current = 0;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    
    setStageReady(false);
    isScrollEventLockedRef.current = true;
    
    if (setIsAnimating) setIsAnimating(true);
    if (setIsTransitioning) setIsTransitioning(true);
    setIsScrolling(true);
    
    setCurrentStage(newStage);
    
    // Use original transition time for mobile, optimized for desktop
    const transitionTime = isMobile ? 900 : 650;
    setTimeout(() => {
      setIsScrolling(false);
      if (setIsAnimating) setIsAnimating(false);
      if (setIsTransitioning) setIsTransitioning(false);
      
      setTimeout(() => {
        setStageReady(true);
        isScrollEventLockedRef.current = false;
      }, isMobile ? 150 : 100); // Original delay for mobile, optimized for desktop
    }, transitionTime);
    
    return true;
  }, [totalStages, isScrolling, setIsAnimating, setIsTransitioning, isExiting, currentStage, isMobile, stageIndices]);
  
  // Reset scroll accumulator when not actively scrolling
  const resetAccumulatedScroll = useCallback(() => {
    accumulatedScrollRef.current = 0;
    scrollTimeoutRef.current = null;
  }, []);
  
  // Update useImperativeHandle to handle mobile stages
  useImperativeHandle(ref, () => ({
    nextStage: () => goToStage(currentStage + 1),
    prevStage: () => {
      // If we're going back to landing, apply special transition
      const sourceIndex = isMobile ? stageIndices.ACHIEVEMENTS_STAGE_INDEX : stageIndices.QUOTES_STAGE_INDEX;
      if (currentStage === sourceIndex) {
        handleLandingPageTransition('up');
      }
      return goToStage(currentStage - 1);
    },
    completeStaging,
    getCurrentStage: () => currentStage,
    getTotalStages: () => totalStages,
    setStage: (stage) => {
      // When manually setting to skills stage, mark as reached
      const lastStageIndex = isMobile ? stageIndices.SKILLS_STAGE_INDEX : stageIndices.SKILLS_STAGE_INDEX;
      if (stage === lastStageIndex) {
        setHasReachedSkills(true);
      }
      
      // If we're setting to landing from appropriate source, apply special transition
      const sourceIndex = isMobile ? stageIndices.ACHIEVEMENTS_STAGE_INDEX : stageIndices.QUOTES_STAGE_INDEX;
      if (stage === stageIndices.LANDING_STAGE_INDEX && currentStage === sourceIndex) {
        handleLandingPageTransition('up');
      }
      
      setTransitionDirection(stage > currentStage ? 'down' : 'up');
      return goToStage(stage);
    },
    forceSkillsTransition: () => {
      setHasReachedSkills(true);
      setStageReady(true);
      setIsComplete(false);
      setIsExiting(false);
      document.body.style.overflow = 'hidden';
      const lastStageIndex = isMobile ? stageIndices.SKILLS_STAGE_INDEX : stageIndices.SKILLS_STAGE_INDEX;
      return goToStage(lastStageIndex);
    },
    handleLandingPageTransition,
    isMobile
  }), [currentStage, totalStages, goToStage, completeStaging, hasReachedSkills, handleLandingPageTransition, isMobile]);
  
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
  
  // Optimize wheel event handler for smoother transitions
  useEffect(() => {
    // Use a more efficient debounce mechanism
    let scrollTimeoutId = null;
    let lastScrollTimestamp = 0;
    const scrollCooldown = 120; // Faster response time for desktop
    
    const handleScroll = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      const now = performance.now(); // More precise timing
      if (now - lastScrollTimestamp < scrollCooldown) return;
      
      // Accumulate scroll with faster response
      accumulatedScrollRef.current += e.deltaY;
      
      // Clear any pending timeout to prevent multiple transitions
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
      
      // Use a shorter timeout for more immediate feel
      scrollTimeoutId = setTimeout(() => {
        const accScroll = accumulatedScrollRef.current;
        const direction = accScroll > 0 ? 'down' : 'up';
        setTransitionDirection(direction);
        
        // Calculate which stage is the skills (last) stage
        const lastStageIndex = isMobile ? stageIndices.SKILLS_STAGE_INDEX : totalStages - 1;
        
        // TIMELINE TRANSITION: Check if we're at the skills stage and scrolling down
        if (currentStage === lastStageIndex && direction === 'down') {
          // For immediate transition, use a lower threshold for responsiveness
          const isSignificantScroll = Math.abs(accScroll) > scrollThreshold * 0.8;
          
          if (isSignificantScroll) {
            console.log("Natural transition to timeline view");
            completeStaging();
            resetAccumulatedScroll();
            return;
          }
        }
        
        // Rest of the navigation logic with improved responsiveness
        if (currentStage === lastStageIndex) {
          // Only handle upward scrolls at this point
          if (accScroll < -scrollThreshold * 0.8) { // Lower threshold for responsiveness
            goToStage(currentStage - 1);
          }
        } else {
          // Normal stage navigation with improved sensitivity
          if (Math.abs(accScroll) < scrollThreshold * 0.7) return; // Ignore small movements
          
          if (accScroll > 0) {
            // Fast forward logic with better thresholds
            const sourceToSkillsJump = isMobile ? 
              (currentStage === stageIndices.ACHIEVEMENTS_STAGE_INDEX && accScroll > scrollThreshold * 2.5) :
              (currentStage === stageIndices.QUOTES_STAGE_INDEX && accScroll > scrollThreshold * 2.5);
              
            if (sourceToSkillsJump) {
              goToStage(lastStageIndex);
            } else {
              goToStage(currentStage + 1);
            }
          } else if (accScroll < 0 && currentStage > 0) {
            // Fast backward logic
            const backToLandingJump = isMobile ? 
              (currentStage === stageIndices.ACHIEVEMENTS_STAGE_INDEX && accScroll < -scrollThreshold * 2.5) :
              (currentStage === stageIndices.QUOTES_STAGE_INDEX && accScroll < -scrollThreshold * 2.5);
              
            if (backToLandingJump) {
              goToStage(0);
            } else {
              goToStage(currentStage - 1);
            }
          }
        }
        
        // Reset for next scroll
        resetAccumulatedScroll();
        lastScrollTimestamp = now;
      }, 20); // Very short timeout for immediate response
    };
    
    // Use passive event listener for better performance
    window.addEventListener('wheel', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
    };
  }, [
    currentStage, 
    isComplete, 
    isScrolling, 
    completeStaging, 
    scrollThreshold, 
    isExiting,
    stageReady,
    resetAccumulatedScroll,
    isMobile,
    totalStages,
    stageIndices,
    goToStage
  ]);
  
  // Modify touch event handling to use the original behavior for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastTouchY = 0;
    let touchVelocity = 0;
    let touchDirection = 'none';
    let touchMoving = false;
    
    // Original touch start handler for mobile
    const handleTouchStart = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      touchStartTime = Date.now(); // Revert to original Date.now()
      touchMoving = false;
      touchDirection = 'none';
      touchVelocity = 0;
      
      // Reset accumulated scroll on new touch
      accumulatedScrollRef.current = 0;
    };
    
    // Original touch move handler with original thresholds for mobile
    const handleTouchMove = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      const instantDelta = lastTouchY - currentY;
      lastTouchY = currentY;
      
      // Track current direction
      touchDirection = instantDelta > 0 ? 'down' : 'up';
      
      // Calculate velocity (px per ms)
      const now = Date.now();
      const timeDelta = now - touchStartTime;
      if (timeDelta > 0) {
        touchVelocity = Math.abs(deltaY) / timeDelta;
      }
      
      // Mark as moving after original threshold
      if (Math.abs(deltaY) > 5) {
        touchMoving = true;
      }
      
      // Accumulate total movement
      accumulatedScrollRef.current = deltaY;
      
      // Calculate which stage is the skills (last) stage
      const lastStageIndex = isMobile ? stageIndices.SKILLS_STAGE_INDEX : totalStages - 1;
      
      // ORIGINAL MOBILE DETECTION: For last stage, with original sensitivity
      if (currentStage === lastStageIndex && touchDirection === 'down') {
        // Detect intent to scroll to timeline with the original threshold for mobile
        const mobileExitThreshold = 20; // Original threshold
        const isHighVelocity = touchVelocity > 0.3; // Original velocity detection
        
        // Exit on meaningful downward movement or fast flick
        if ((deltaY > mobileExitThreshold && touchMoving) || isHighVelocity) {
          console.log("Mobile smooth transition to timeline view", { deltaY, velocity: touchVelocity });
          completeStaging();
          return;
        }
      }
    };
    
    // Original touch end handler with original sensitivity for mobile
    const handleTouchEnd = (e) => {
      if (isComplete || isScrolling || isExiting || !stageReady || isScrollEventLockedRef.current) return;
      
      const now = Date.now();
      if (now - lastScrollTime < 180) return; // Original cooldown for mobile
      setLastScrollTime(now);
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      // Only process if there was some significant movement
      if (Math.abs(deltaY) < 8) return; // Original threshold
      
      const touchDuration = now - touchStartTime;
      const velocity = Math.abs(deltaY) / touchDuration;
      const isFastSwipe = velocity > 0.4; // Original threshold for mobile
      
      setTransitionDirection(deltaY > 0 ? 'down' : 'up');
      
      // Calculate which stage is the skills (last) stage
      const lastStageIndex = isMobile ? stageIndices.SKILLS_STAGE_INDEX : totalStages - 1;
      
      // FORCE EXIT: If at skills stage and swiping down, immediately exit
      if (currentStage === lastStageIndex && deltaY > 0) {
        console.log("Mobile touch end transition to timeline");
        completeStaging();
        resetAccumulatedScroll();
        return;
      }
      
      // Original touch navigation logic
      if (currentStage === lastStageIndex) {
        // Only handle upward swipes at this point (to previous stage)
        if (deltaY < -scrollThreshold) {
          goToStage(currentStage - 1);
        }
      } else {
        // Original threshold for mobile touch
        const mobileThreshold = isMobile ? scrollThreshold * 0.6 : scrollThreshold; // Original mobile threshold
        
        if (Math.abs(deltaY) < mobileThreshold && !isFastSwipe) return;
        
        // Normal stage navigation
        if (deltaY > 0) {
          // Fast forward to skills with strong swipe for mobile/desktop
          const sourceToSkillsJump = isMobile ? 
            (currentStage === stageIndices.ACHIEVEMENTS_STAGE_INDEX && (isFastSwipe || deltaY > mobileThreshold * 2)) :
            (currentStage === stageIndices.QUOTES_STAGE_INDEX && (isFastSwipe || deltaY > mobileThreshold * 2));
            
          if (sourceToSkillsJump) {
            goToStage(lastStageIndex);
          } else {
            goToStage(currentStage + 1);
          }
        } else if (deltaY < 0 && currentStage > 0) {
          // Fast backward to landing with strong swipe
          const backToLandingJump = isMobile ? 
            (currentStage === stageIndices.ACHIEVEMENTS_STAGE_INDEX && (isFastSwipe || deltaY < -mobileThreshold * 2)) :
            (currentStage === stageIndices.QUOTES_STAGE_INDEX && (isFastSwipe || deltaY < -mobileThreshold * 2));
            
          if (backToLandingJump) {
            goToStage(0);
          } else {
            goToStage(currentStage - 1);
          }
        }
      }
      
      resetAccumulatedScroll();
    };
    
    // Add touch event listeners with passive flag for better performance
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
    isExiting,
    stageReady,
    resetAccumulatedScroll,
    isMobile,
    totalStages,
    stageIndices,
    goToStage
  ]);

  // Update useEffect to set appropriate scroll threshold for mobile
  useEffect(() => {
    // Use a lower threshold for mobile devices
    if ('ontouchstart' in window || isMobile) {
      setScrollThreshold(10); // Lower threshold for more responsive feel on mobile
    } else {
      setScrollThreshold(15); // Desktop threshold
    }
  }, [isMobile]);
  
  // Reset mobile transition durations to original values
  const getStageTransition = (index) => {
    // Use a faster, more optimized cubic-bezier for smoother motion
    const performantEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';
    
    // Original timing for mobile, optimized for desktop
    const landingTransition = isMobile ? 
      `opacity 0.85s ${performantEasing}, transform 0.85s ${performantEasing}, filter 0.85s ${performantEasing}` : 
      `opacity 0.65s ${performantEasing}, transform 0.65s ${performantEasing}, filter 0.65s ${performantEasing}`;
      
    const regularTransition = isMobile ? 
      `opacity 0.8s ${performantEasing}, transform 0.8s ${performantEasing}, filter 0.8s ${performantEasing}` : 
      `opacity 0.6s ${performantEasing}, transform 0.6s ${performantEasing}, filter 0.6s ${performantEasing}`;
    
    // Landing page gets special transition
    if (index === 0) {
      return landingTransition;
    } 
    // Other sections use standard transitions
    else {
      return regularTransition;
    }
  };
  
  // Restore original landing page style for mobile but keep optimized for desktop
  const getLandingPageStyle = () => {
    const isActive = currentStage === stageIndices.LANDING_STAGE_INDEX;
    const isPrev = currentStage === stageIndices.LANDING_STAGE_INDEX + 1;
    const isInitialLoad = isActive && !isScrolling && !isExiting && initialStage === stageIndices.LANDING_STAGE_INDEX;
    
    // Different base styles for mobile vs desktop
    const baseStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: isMobile ? 'transform, opacity, filter' : 'transform, opacity',
      backfaceVisibility: isMobile ? 'visible' : 'hidden',
      perspective: isMobile ? 'none' : 1000,
      transform: isMobile ? 'none' : 'translateZ(0)',
      transformStyle: 'preserve-3d',
      transition: getStageTransition(0)
    };

    // When landing page is active
    if (isActive) {
      return {
        ...baseStyles,
        opacity: 1,
        visibility: 'visible',
        transform: isMobile ? 'translateY(0)' : 'translate3d(0, 0, 0)',
        filter: 'blur(0)',
        animation: isInitialLoad ? 
          (isMobile ? 'landingEnter 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'landingEnter 0.85s cubic-bezier(0.33, 1, 0.68, 1)') : 
          'none',
      };
    } 
    // When landing page is the previous section (scrolling down)
    else if (isPrev && transitionDirection === 'down') {
      return {
        ...baseStyles,
        opacity: 0,
        visibility: 'visible',
        transform: isMobile ? 'translateY(-100px)' : 'translate3d(0, -70px, 0)',
        filter: isMobile ? 'blur(5px)' : 'blur(4px)',
      };
    } 
    // When coming back to landing (scrolling up) - just position it
    else if (currentStage === stageIndices.QUOTES_STAGE_INDEX && transitionDirection === 'up') {
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
        transform: transitionDirection === 'down' ? 
          (isMobile ? 'translateY(-100px)' : 'translate3d(0, -70px, 0)') : 
          (isMobile ? 'translateY(100px)' : 'translate3d(0, 70px, 0)'),
        filter: isMobile ? 'blur(5px)' : 'blur(4px)',
      };
    }
  };
  
  // Update transform styles to use different values for mobile vs desktop
  const getStageTransform = (index) => {
    const isCurrentStage = index === currentStage;
    const isNextStage = index === currentStage + 1;
    const isPrevStage = index === currentStage - 1;
    
    // Mobile uses original transforms, desktop uses optimized transforms
    if (isMobile) {
      // Original mobile transforms
      
      // Active stage - centered
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
    } else {
      // Optimized desktop transforms with hardware acceleration
      
      // Active stage - perfectly centered with hardware acceleration
      if (isCurrentStage) {
        return 'translate3d(0, 0, 0)';
      }
      
      // When scrolling down
      if (transitionDirection === 'down') {
        // Previous sections move up and out
        if (index < currentStage) {
          // Landing page moves up and out of view
          return 'translate3d(0, -70px, 0)';
        } 
        // Next section waits below
        else if (isNextStage) {
          return 'translate3d(0, 70px, 0)';
        }
        // Further sections wait further below
        else {
          return 'translate3d(0, 140px, 0)';
        }
      } 
      // When scrolling up
      else {
        // Future sections move down and out
        if (index > currentStage) {
          return 'translate3d(0, 70px, 0)';
        } 
        // Previous section waits above
        else if (isPrevStage) {
          return 'translate3d(0, -70px, 0)';
        }
        // Further past sections wait further above
        else {
          return 'translate3d(0, -140px, 0)';
        }
      }
    }
  };
  
  // Get stage-specific transform effects with smoother movements
  const getStageEffects = (index) => {
    const isCurrentStage = index === currentStage;
    
    // All stages get blurred and fade when not active
    return {
      opacity: isCurrentStage ? 1 : 0,
      filter: isCurrentStage ? 'blur(0)' : 'blur(5px)',
      visibility: isCurrentStage ? 'visible' : 'visible', // Keep visible for transitions
    };
  };
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Update useEffect to recalculate stage indices
  // Update useEffect to recalculate indices and check actual children count
  useEffect(() => {
    // If we have a new structure with conditional rendering,
    // make sure we don't have an invalid currentStage
    const actualChildCount = Children.count(children);
    
    // Safely check without causing a reference error
    if (currentStage >= actualChildCount) {
      console.log(`Adjusting current stage from ${currentStage} to ${actualChildCount - 1} (total: ${actualChildCount})`);
      setCurrentStage(Math.max(0, actualChildCount - 1));
    }
  }, [children, currentStage]);

  // Once complete, don't render anything
  if (isComplete) {
    return null;
  }
  
  return (
    <div 
      data-staged-scroll-container
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh', 
        backgroundColor: fadeColor,
        zIndex: 5,
        opacity: isExiting ? 0 : 1,
        transition: isMobile ? 
          'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 
          'opacity 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
        pointerEvents: isExiting ? 'none' : 'auto',
        willChange: 'opacity',
        backfaceVisibility: isMobile ? 'visible' : 'hidden',
        perspective: isMobile ? 'none' : 1000,
        overflow: 'hidden'
      }}
    >
      {/* Add optimized animation keyframes with mobile/desktop variations */}
      <style>
        {`
          @keyframes landingEnter {
            ${isMobile ? `
              0% { opacity: 0; transform: translateY(60px); filter: blur(3px); }
              50% { opacity: 0.8; transform: translateY(-8px); filter: blur(1px); }
              75% { transform: translateY(3px); }
              100% { opacity: 1; transform: translateY(0); filter: blur(0); }
            ` : `
              0% { opacity: 0; transform: translate3d(0, 40px, 0); filter: blur(3px); }
              50% { opacity: 0.9; transform: translate3d(0, -5px, 0); filter: blur(1px); }
              75% { transform: translate3d(0, 2px, 0); }
              100% { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
            `}
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