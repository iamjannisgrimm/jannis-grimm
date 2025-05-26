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
import { useInView } from "../components/hooks/useInView";
import { useFadeEffect } from "../components/hooks/useFadeEffect";
import { useMobileInView } from "../components/hooks/useMobileInView";
import { useMobileFadeEffect } from "../components/hooks/useMobileFadeEffect";
import skills from "../data/skills";

export function Home() {
  const [chatFocus, setChatFocus] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatDirection, setChatDirection] = useState('active'); // 'active' or 'inactive'
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  ); 
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
  
  // Special effect for profile image - gradual fade as it scrolls off screen
  useEffect(() => {
    const calculateImageOpacity = () => {
      const image = profileImageRef.current;
      if (!image) return;
      
      const rect = image.getBoundingClientRect();
      const imageHeight = rect.height;
      const imageTop = rect.top;
      
      // Start fading when top of image is 100px from the top edge
      // Complete fade BEFORE bottom of image reaches the top edge, but much more slowly
      if (imageTop < 100) {
        // For the profile image, we use its full height as the fade distance
        // This makes it fade more slowly as it's larger
        const fadeDistance = imageHeight * 0.9; // Use 90% of image height for fade distance
        
        // Adjust scroll progress to create a slower fade
        const scrollProgress = (100 - imageTop) / fadeDistance;
        
        // Apply a more gradual fade curve by using a square root function
        // This makes the initial fade happen more quickly but slows down as it progresses
        const adjustedProgress = Math.sqrt(scrollProgress) * 0.8; // 80% of sqrt for even slower fade
        
        setProfileImageOpacity(Math.max(0, 1 - Math.min(1, adjustedProgress)));
      }
      else {
        // Image is fully visible or below the fade threshold
        setProfileImageOpacity(1);
      }
    };
    
    window.addEventListener('scroll', calculateImageOpacity, { passive: true });
    calculateImageOpacity(); // Initial calculation
    
    return () => window.removeEventListener('scroll', calculateImageOpacity);
  }, []);
  
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

  useEffect(() => {
    function handleScroll() {
      const scrolled = window.scrollY > 20; // Lower threshold for scroll detection
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
  }, [isMobile, showChat, chatFocus]);

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

  return (
    <div className="home-container">
      <div 
        className={`blurrable-content ${showChat ? 'chat-active' : 'chat-inactive'}`}
      >
        <div className={`top-section${chatFocus ? " fade" : ""}`}>
          <div className="center-container">
            <div
              className="content-container"
              style={
                !isMobile
                  ? {
                      transform: "scale(0.9)",
                      transformOrigin: "top center",
                      width: "100%",
                    }
                  : { paddingTop: isMobile ? "80px" : "0" } // Add padding only for mobile
              }
            >
              <ProfileHeader
                image="me/me.png"
                title="Engineer. Innovator. Leader."
                titleRef={profileTitleRef}
                titleOpacity={profileTitleOpacity}
                imageRef={profileImageRef}
                imageOpacity={profileImageOpacity}
              />
            </div>
          </div>

          <div
            style={{
              paddingTop: "5px",
              display: isMobile ? "flex" : "none",
              justifyContent: "center",
              transition: "opacity 0.5s cubic-bezier(0.33,1,0.68,1)",
              opacity: isScrolled ? 0 : 1,
              pointerEvents: isScrolled ? "none" : "auto",
            }}
          >
            <Chevron />
          </div>

          {/* Achievements: Mobile = fade, Desktop = always visible */}
          {isMobile ? (
            <section
              ref={mobileAchievementsRef}
              style={{
                opacity: showChat ? 0 : mobileAchievementsOpacity,
                transition: "opacity 0.3s ease-out",
                pointerEvents: (showChat || mobileAchievementsOpacity <= 0.1) ? "none" : "auto",
                marginTop: "30px",
                visibility: showChat ? "hidden" : "visible"
              }}
            >
              <h2></h2>
              <Achievements />
            </section>
          ) : (
            <section ref={achievementsSectionRef} style={{ opacity: achievementsSectionOpacity, transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)" }}>
              <h2></h2>
              <Achievements />
            </section>
          )}

          {isMobile ? (
            <div
              ref={mobileContribRef}
              className="center-container contributions-container"
              style={{
                opacity: showChat ? 0 : mobileContribOpacity,
                transition: "opacity 0.3s ease-out",
                pointerEvents: (showChat || mobileContribOpacity <= 0.1) ? "none" : "auto",
                marginTop: "20px",
                visibility: showChat ? "hidden" : "visible"
              }}
            >
              <div className="content-container">
                <GitHubContributions username="iamjannisgrimm" />
              </div>
            </div>
          ) : (
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
                opacity: githubOpacity,
                transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
                marginBottom: "-100px", // Reasonable negative margin
                transform: !isMobile ? "scale(0.9)" : "none", // Scale down slightly on desktop
                transformOrigin: "center bottom"
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
          )}
          
        </div>

        <section 
          ref={quotesRef}
          style={{
            opacity: quotesOpacity,
            transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
            paddingBottom: "10px",
            marginTop: isMobile ? "100px" : "0px", // No margin for desktop now
            position: "relative",
            zIndex: 1 // Ensure quotes appear above any overlapping elements
          }}
        >
          <h2></h2>
          <Quotes />
        </section>

        {/* Skills Section */}
        <section 
          style={{
            marginBottom: "60px" // Keep extra space after the skills section
          }}
        >
          <div className="center-container">
            <div className="content-container">
              <Skills skills={skills} />
            </div>
          </div>
        </section>

        <div className="center-container">
          <div className="content-container">
            <Timeline items={timelineData} />
          </div>
        </div>

        <div 
          className="center-container"
          ref={footerRef}
          style={{
            opacity: footerOpacity,
            transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)"
          }}
        >
          <div className="content-container">
            <Footer />
          </div>
        </div>
      </div>
      <div className={`chatbot-fixed-wrapper${showChat ? "" : " hidden"}`}>
        <div className="chatbot-fixed-container">
          <Chatbot
            onFocus={handleChatFocus}
            onBlur={handleChatBlur}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;