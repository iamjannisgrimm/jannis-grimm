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
import skills from "../data/skills";

export function Home() {
  const [chatFocus, setChatFocus] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  ); 
  const [showContributions, setShowContributions] = useState(false);

  // For Achievements fade-in (keep using original useInView for this specific transition)
  const [achievementsRef, achievementsInView] = useInView({}, 1200);
  const [contribRef, contribInView] = useInView({}, 1200);
  
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
    topEdgeDistance: 100,
    bottomEdgeDistance: 200,
    fadeTop: true,
    fadeBottom: true
  });

  const [githubRef, githubOpacity] = useFadeEffect({
    topEdgeDistance: 100,
    bottomEdgeDistance: 200,
    fadeTop: true,
    fadeBottom: true
  });

  const [quotesRef, quotesOpacity] = useFadeEffect({
    topEdgeDistance: 100,
    bottomEdgeDistance: 200,
    fadeTop: true,
    fadeBottom: true
  });

  const [footerRef, footerOpacity] = useFadeEffect({
    topEdgeDistance: 100,
    bottomEdgeDistance: 0, // No bottom fade for footer
    fadeTop: true,
    fadeBottom: false
  });

  useEffect(() => {
    function handleScroll() {
      const isScrolled = window.scrollY > 0;
      setShowChat(!isScrolled);
      if (isMobile) {
        setShowContributions(isScrolled);
      } else {
        setShowContributions(true);
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

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

  return (
    <div className="home-container">
      <div className="blurrable-content">
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
                  : {}
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
              paddingTop: "32px",
              display: isMobile ? "flex" : "none",
              justifyContent: "center",
              transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
              opacity: showContributions ? 0 : 1,
              pointerEvents: showContributions ? "none" : "auto",
            }}
          >
            <Chevron />
          </div>

          {/* Achievements: Mobile = fade, Desktop = always visible */}
          {isMobile ? (
            <section
              ref={achievementsRef}
              style={{
                opacity: achievementsInView && showContributions ? 1 : 0,
                transition: "opacity 0.7s cubic-bezier(0.33,1,0.68,1)",
                pointerEvents: achievementsInView && showContributions ? "auto" : "none"
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
              ref={contribRef}
              className="center-container contributions-container"
              style={{
                opacity: contribInView && showContributions ? 1 : 0,
                transition: "opacity 0.7s cubic-bezier(0.33,1,0.68,1)",
                pointerEvents: contribInView && showContributions ? "auto" : "none"
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
          )}
          
        </div>

        <section 
          ref={quotesRef}
          style={{
            opacity: quotesOpacity,
            transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
            paddingBottom: "10px"
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
            onFocus={() => setChatFocus(true)}
            onBlur={() => setChatFocus(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;