import React, { useState, useEffect, useRef } from "react";
import Timeline from "../components/timeline/Timeline";
import timelineData from "../data/timeline-data";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Chatbot from "../components/chatbot/Chatbot";
import Footer from "../components/Footer";
import Achievements from '../components/Achievements';
import Quotes from '../components/Quotes';
import Skills from '../components/Skills';
import Chevron from "../components/Chevron";
import ScrollToTop from "../components/ScrollToTop";
import { useInView } from "../components/hooks/useInView";
import { useFadeEffect } from "../components/hooks/useFadeEffect";
import { useMobileInView } from "../components/hooks/useMobileInView";
import { useMobileFadeEffect } from "../components/hooks/useMobileFadeEffect";
import StagedScroll from "../components/StagedScroll";
import StageWrapper from "../components/StageWrapper";
import skills from "../data/skills";

export function Home() {
  const [chatFocus, setChatFocus] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatDirection, setChatDirection] = useState('active');
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  ); 
  
  // Stage management 
  const [stagingComplete, setStagingComplete] = useState(false);
  const [normalScrollEnabled, setNormalScrollEnabled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Ref to the StagedScroll component
  const stagedScrollRef = useRef(null);
  
  // Track active stage - handle all pages through StagedScroll
  const [activeStage, setActiveStage] = useState(0); // 0 = landing, 1 = quotes, 2 = skills
  
  const [showContributions, setShowContributions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Use the mobile-specific fade effects for the mobile view
  const [mobileAchievementsRef, mobileAchievementsOpacity] = useMobileFadeEffect({
    topFadeDistance: 20,
    bottomFadeDistance: 60,
    startVisibleThreshold: 0.1
  });
  
  const [mobileContribRef, mobileContribOpacity] = useMobileFadeEffect({
    topFadeDistance: 100,
    bottomFadeDistance: 120,
    startVisibleThreshold: 0.1
  });
  
  // For achieving the "show once" behavior in desktop view
  const [achievementsRef, achievementsInView] = useMobileInView(0.15, true);
  const [contribRef, contribInView] = useMobileInView(0.15, true);
  
  // Individual fade effects for each component with both top and bottom edge detection
  const [profileTitleRef, profileTitleOpacity] = useFadeEffect({ 
    topEdgeDistance: 100, 
    bottomEdgeDistance: 150, 
    fadeBottom: false // Only fade when scrolling up past the top
  });
  
  // Custom implementation for profile image that fades gradually as it scrolls off screen
  const profileImageRef = useRef(null);
  const [profileImageOpacity, setProfileImageOpacity] = useState(1);
  
  // Enhanced fade effects with both top and bottom edge detection
  const [achievementsSectionRef, achievementsSectionOpacity] = useFadeEffect({
    topEdgeDistance: isMobile ? 80 : 100,
    bottomEdgeDistance: isMobile ? 100 : 200,
    fadeTop: true,
    fadeBottom: true
  });

  const [githubRef, githubOpacity] = useFadeEffect({
    topEdgeDistance: isMobile ? 80 : 100,
    bottomEdgeDistance: isMobile ? 100 : 200,
    fadeTop: true,
    fadeBottom: true
  });

  const [quotesRef, quotesOpacity] = useFadeEffect({
    topEdgeDistance: isMobile ? 80 : 100,
    bottomEdgeDistance: isMobile ? 100 : 200,
    fadeTop: true,
    fadeBottom: true
  });

  const [footerRef, footerOpacity] = useFadeEffect({
    topEdgeDistance: isMobile ? 80 : 100,
    bottomEdgeDistance: 0, // No bottom fade for footer
    fadeTop: true,
    fadeBottom: false
  });

  // Handle scroll in normal mode
  useEffect(() => {
    function handleScroll() {
      if (!normalScrollEnabled) return; // Only process when in normal scrolling mode
      
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      // Don't change chat visibility while it's focused
      if (!chatFocus && showChat !== !scrolled) {
        setChatDirection(scrolled ? 'inactive' : 'active');
        setShowChat(!scrolled);
      }
      
      // For mobile, set the flag but don't tie component visibility directly to it
      if (isMobile) {
        setShowContributions(scrolled);
      } else {
        setShowContributions(true);
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, showChat, chatFocus, normalScrollEnabled]);

  useEffect(() => {
    function handleResize() {
      const m = window.innerWidth <= 600;
      setIsMobile(m);
      setShowContributions(!m || window.scrollY > 0);
    }
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle chat visibility and animations with improved mobile support
  const handleChatVisibility = (isVisible) => {
    setChatDirection(isVisible ? 'active' : 'inactive');
    setShowChat(isVisible);
  };
  
  // Enhanced focus/blur handlers for chatbot
  const handleChatFocus = () => {
    setChatFocus(true);
    // On mobile, ensure the chat stays visible when focused
    if (isMobile) {
      setShowChat(true);
    }
  };
  
  const handleChatBlur = () => {
    setChatFocus(false);
    // On mobile, don't immediately hide the chat on blur
    // The visibility will be managed by the scroll handler
  };
  
  // Handle staging completion
  const handleStagingComplete = () => {
    // Enable normal scrolling immediately 
    document.body.style.overflow = 'auto';
    setStagingComplete(true);
    setNormalScrollEnabled(true);
    
    // Hide chat input when in timeline view
    setShowChat(false);

    // Make sure the timeline is immediately ready for viewing
    // with the skills section still in view at the top
    requestAnimationFrame(() => {
      // Make sure we're at the top of the skills section
      window.scrollTo(0, 0);
    });
  };

  // Handle stage changes
  const handleStageChange = (newStage) => {
    setActiveStage(newStage);
    
    // Manage chat visibility based on stage
    if (newStage === 0) {
      // Landing page - show chat
      setShowChat(true);
    } else if (newStage === 2) {
      // Skills - hide chat
      setShowChat(false);
    }
  };

  useEffect(() => {
    // Add a keydown handler for debugging and manual navigation
    const handleKeyDown = (e) => {
      // Skip if not in staged scroll mode
      if (stagingComplete) return;
      
      // Skip if already animating or transitioning
      if (isAnimating || isTransitioning) {
        return;
      }
      
      // Arrow down or Page Down to force move to next stage
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (stagedScrollRef.current) {
          stagedScrollRef.current.nextStage();
        }
      }
      
      // Arrow up or Page Up to force move to previous stage
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (stagedScrollRef.current) {
          stagedScrollRef.current.prevStage();
        }
      }
      
      // 's' key to skip staged scrolling and go directly to timeline
      if (e.key === 's') {
        if (stagedScrollRef.current) {
          stagedScrollRef.current.completeStaging();
        } else {
          setStagingComplete(true);
          setNormalScrollEnabled(true);
          document.body.style.overflow = 'auto';
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stagingComplete, isAnimating, isTransitioning]);

  // Handle scrolling back to the top (from timeline to staged mode)
  useEffect(() => {
    // Only enable this functionality when in normal scroll mode
    if (!normalScrollEnabled) return;
    
    const handleScrollToTop = () => {
      // If we're at the very top of the page and normal scrolling is enabled
      if (window.scrollY <= 5 && stagingComplete) {
        // Add resistance when transitioning back to staged mode
        // Only reactivate staged scrolling after a small amount of time at the top
        // This prevents accidental triggers
        
        // Create a small delay to check if user is intentionally at the top
        const reactivationTimeout = setTimeout(() => {
          // Only proceed if we're still at the top after the delay
          if (window.scrollY <= 5) {
            // Reactivate staged scrolling with direct DOM manipulation to avoid blank screen
            // Immediately show skills section first to prevent blank screen
            document.body.style.overflow = 'hidden';
            
            // Prepare visible skills section first
            const skillsDiv = document.createElement('div');
            skillsDiv.style.position = 'fixed';
            skillsDiv.style.top = '0';
            skillsDiv.style.left = '0';
            skillsDiv.style.width = '100%';
            skillsDiv.style.height = '100vh';
            skillsDiv.style.backgroundColor = '#fff';
            skillsDiv.style.zIndex = '10';
            skillsDiv.style.display = 'flex';
            skillsDiv.style.alignItems = 'center';
            skillsDiv.style.justifyContent = 'center';
            skillsDiv.innerHTML = '<div style="max-width: 700px; width: 100%; padding: 0 20px;"></div>';
            document.body.appendChild(skillsDiv);
            
            // Get skills content from the page and clone it into our temporary div
            const skillsContent = document.querySelector('.skills-wrapper');
            if (skillsContent) {
              const clonedSkills = skillsContent.cloneNode(true);
              skillsDiv.querySelector('div').appendChild(clonedSkills);
            }
            
            // Reset states and scrolling
            setStagingComplete(false);
            setNormalScrollEnabled(false);
            setIsAnimating(false);
            setIsTransitioning(false);
            window.scrollTo(0, 0);
            
            // FORCE immediate transition to Skills section using the explicit method
            setTimeout(() => {
              if (stagedScrollRef.current) {
                // Use the special method we added for guaranteed skills transition
                stagedScrollRef.current.forceSkillsTransition();
                
                // Show chat input for the staged view
                setShowChat(true);
                setChatDirection('active');
                
                // Remove our temporary skills div after staged scrolling is ready
                setTimeout(() => {
                  if (skillsDiv.parentNode) {
                    document.body.removeChild(skillsDiv);
                  }
                }, 300);
              } else {
                // Fallback if ref isn't available
                if (skillsDiv.parentNode) {
                  document.body.removeChild(skillsDiv);
                }
                document.body.style.overflow = 'auto';
              }
            }, 50);
          }
        }, 150); // Small delay to add resistance
        
        return () => clearTimeout(reactivationTimeout);
      }
    };
    
    window.addEventListener('scroll', handleScrollToTop, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollToTop);
  }, [normalScrollEnabled, stagingComplete]);

  return (
    <div className="home-container">
      {/* Normal scrolling content - always present but initially hidden by StagedScroll */}
      <div 
        className={`blurrable-content ${showChat ? 'chat-active' : 'chat-inactive'}`}
        style={{ 
          visibility: normalScrollEnabled ? 'visible' : 'hidden',
          position: normalScrollEnabled ? 'relative' : 'absolute',
          zIndex: 1
        }}
      >
        {/* These sections are not displayed in normal scroll mode */}
        <div style={{ display: 'none' }}>
          <div className="top-section">
            <ProfileHeader
              image="me/me.png"
              title="Engineer. Innovator. Leader."
              titleRef={profileTitleRef}
              titleOpacity={profileTitleOpacity}
              imageRef={profileImageRef}
              imageOpacity={profileImageOpacity}
            />
            <Achievements />
            <GitHubContributions username="iamjannisgrimm" />
          </div>
          <Quotes />
        </div>
        
        {/* Skills section - this will be visible and appear naturally at the top 
            when staged mode is exited - maintain same styling as staged mode */}
        <div className="center-container" style={{ 
          paddingTop: '8vh', // Adjust to match staged mode exactly
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="content-container" style={{ padding: '0 20px' }}>
            {/* Use exact same props as the staged version to ensure consistent appearance */}
            <Skills skills={skills} stageMode={true} />
          </div>
        </div>
        
        {/* Timeline follows skills naturally */}
        <div className="center-container timeline-container" style={{ 
          marginTop: '30px', // Adjust spacing after skills
          paddingTop: '0'
        }}>
          <div className="content-container">
            <Timeline items={timelineData} />
          </div>
        </div>

        <div className="center-container" ref={footerRef}>
          <div className="content-container">
            <Footer />
          </div>
        </div>
      </div>
      
      {/* StagedScroll handles all content */}
      {!stagingComplete && (
        <StagedScroll 
          onStagedScrollComplete={handleStagingComplete}
          onStageChange={handleStageChange}
          chatInputVisible={showChat}
          setChatInputVisible={setShowChat}
          fadeTime={0.15}
          initialStage={0}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
          ref={stagedScrollRef}
        >
          {/* Stage 1: Landing Page */}
          <StageWrapper>
            <div className={`blurrable-content ${showChat ? 'chat-active' : 'chat-inactive'}`}>
              <div className={`top-section${chatFocus ? " fade" : ""}`}>
                <div className="center-container">
                  <div
                    className="content-container"
                    style={{
                      transform: "scale(0.9)",
                      transformOrigin: "top center",
                      width: "100%",
                    }}
                  >
                    <ProfileHeader
                      image="me/me.png"
                      title="Engineer. Innovator. Leader."
                      titleRef={profileTitleRef}
                      titleOpacity={1}
                      imageRef={profileImageRef}
                      imageOpacity={1}
                    />
                  </div>
                </div>

                <section ref={achievementsSectionRef} style={{ 
                  opacity: 1,
                  transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)"
                }}>
                  <h2></h2>
                  <Achievements />
                </section>

                <a
                  ref={githubRef}
                  href="https://github.com/iamjannisgrimm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="center-container github-desktop-contributions"
                  style={{ 
                    display: "block", 
                    textDecoration: "none", 
                    color: "inherit", 
                    cursor: "pointer",
                    opacity: 1,
                    transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)"
                  }}
                  title="View GitHub Profile"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("https://github.com/iamjannisgrimm", "_blank", "noopener,noreferrer");
                  }}
                >
                  <div className="content-container">
                    <GitHubContributions username="iamjannisgrimm" />
                  </div>
                </a>
              </div>
            </div>
          </StageWrapper>
          
          {/* Stage 2: Quotes */}
          <StageWrapper>
            <Quotes stageMode={true} />
          </StageWrapper>
          
          {/* Stage 3: Skills */}
          <StageWrapper>
            <Skills skills={skills} stageMode={true} />
          </StageWrapper>
        </StagedScroll>
      )}
      
      {/* Chatbot wrapper */}
      <div className={`chatbot-fixed-wrapper${showChat ? "" : " hidden"}`}>
        <div className="chatbot-fixed-container">
          <Chatbot
            onFocus={handleChatFocus}
            onBlur={handleChatBlur}
          />
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}

export default Home;