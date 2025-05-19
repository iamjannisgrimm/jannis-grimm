import React, { useState, useEffect, useRef } from "react";
import Timeline from "../components/timeline/Timeline";
import timelineData from "../data/timeline-data";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Chatbot from "../components/chatbot/Chatbot";
import Footer from "../components/Footer";
import Achievements from '../components/Achievements';
import Quotes from '../components/Quotes';
import Chevron from "../components/Chevron"; // adjust the path if needed

export function Home() {
  const [chatFocus, setChatFocus] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const [showContributions, setShowContributions] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Simple condition: show when scrolled, hide when at top
      const isScrolled = window.scrollY > 0;
      setShowChat(!isScrolled);
      
      if (isMobile) {
        setShowContributions(isScrolled);
      } else {
        // On desktop, always show
        setShowContributions(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize state based on current scroll position
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  useEffect(() => {
    function handleResize() {
      const m = window.innerWidth <= 600;
      setIsMobile(m);
      // On desktop always show, on mobile depend on scroll position
      setShowContributions(!m || window.scrollY > 0);
    }

    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home-container">
      <div className="blurrable-content">
        <div className={`top-section ${chatFocus ? "fade" : ""}`}>
          <div className="center-container">
            <div className="content-container">
              <ProfileHeader
                image="me/me.png"
                title="Engineer. Innovator. Leader."
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
              pointerEvents: showContributions ? "none" : "auto", // (optional) disables interaction when hidden
            }}
          >
            <Chevron />
          </div>

          {isMobile ? (
            <div className={`center-container contributions-container ${showContributions ? "visible" : "hidden"}`}>
              <div className="content-container">

                <GitHubContributions username="iamjannisgrimm" />
              </div>
            </div>
          ) : (
            <div className="center-container github-desktop-contributions">
              <div className="content-container">
                <GitHubContributions username="iamjannisgrimm" />
              </div>
            </div>
          )}


        <section>
          <h2>My Achievements</h2>
          <Achievements />
        </section>

        {!isMobile && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      paddingTop: "10px",
      opacity: showChat ? 1 : 0,
      transition: "opacity 0.4s cubic-bezier(0.33,1,0.68,1)",
      pointerEvents: showChat ? "auto" : "none"
    }}
  >
    <Chevron />
  </div>
)}

        </div>

        <section>
        <h2>My Achievements</h2>
        <Quotes />
      </section>
        
        <div className="center-container">
          <div className="content-container">
            <Timeline items={timelineData} />
          </div>
        </div>
        
        <div className="center-container">
          <div className="content-container">
            <Footer />
          </div>
        </div>
      </div>
      
      <div className={`chatbot-fixed-wrapper ${showChat ? "" : "hidden"}`}>
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