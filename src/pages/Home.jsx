import React, { useState, useEffect, useRef } from "react";
import Timeline from "../components/timeline/Timeline";
import timelineData from "../data/timeline-data";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Chatbot from "../components/chatbot/Chatbot";
import Footer from "../components/Footer";
import Achievements from '../components/Achievements';
import Quotes from '../components/Quotes';
import Chevron from "../components/Chevron";
import { useInView } from "../components/hooks/useInView";

export function Home() {
  const [chatFocus, setChatFocus] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  ); 
  const [showContributions, setShowContributions] = useState(false);

  // Add this for Achievements fade-in
  const [achievementsRef, achievementsInView] = useInView({}, 1200);
  const [contribRef, contribInView] = useInView({}, 1200);

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
        <div className={`top-section ${chatFocus ? "fade" : ""}`}>
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
            <section>
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
            <div className="center-container github-desktop-contributions">
              <div className="content-container">
                <GitHubContributions username="iamjannisgrimm" />
              </div>
            </div>
          )}

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
          <h2></h2>
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