import React, { useState, useEffect } from "react";
import Timeline from "../components/timeline/Timeline";
import timelineData from "../data/timeline-data";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Chatbot from "../components/chatbot/Chatbot";
import Footer from "../components/Footer";

export function Home() {
  const [chatFocus, setChatFocus] = useState(false);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show chat bar only when scrolled all the way to the top
      setShowChat(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-container">
      <div className="blurrable-content">
        {/* Top section will fade/slide up on chat focus */}
        <div className={`top-section ${chatFocus ? "fade" : ""}`}>
          <div className="center-container">
            <div className="content-container">
              <ProfileHeader
                image="me/me.png"
                title="Engineer. Innovator. Leader"
              />
            </div>
          </div>
          <div className="center-container">
            <div className="content-container">
              <GitHubContributions username="iamjannisgrimm" />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="center-container">
          <div className="content-container">
            <Timeline items={timelineData} />
          </div>
        </div>

        {/* Footer */}
        <div className="center-container">
          <div className="content-container">
            <Footer />
          </div>
        </div>
      </div>

      {/* Floating chat panel, toggles hidden class on scroll */}
      <div
        className={`chatbot-fixed-wrapper ${showChat ? "visible" : "hidden"}`}
      >
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