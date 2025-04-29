import React from "react";
import Timeline from "../components/timeline/Timeline";
import timelineData from "../data/timeline-data";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Chatbot from "../components/chatbot/Chatbot";
import Footer from "../components/Footer";

export function Home() {
  return (
    <div className="home-container">
      {/* All blurrable content */}
      <div className="blurrable-content">
        {/* Profile Header Section */}
        <div className="center-container">
          <div className="content-container">
            <ProfileHeader
              image="me/me.png"
              title="Engineer. Innovator. Leader"
            />
          </div>
        </div>
        
        {/* GitHub Contributions Section */}
        <div className="center-container">
          <div className="content-container">
            <GitHubContributions username="iamjannisgrimm" />
          </div>
        </div>
        
        {/* Timeline Section */}
        {/*
        <div className="center-container">
          <div className="content-container">
            <Timeline items={timelineData} />
          </div>
        </div>
        */}
        
        {/* Footer Section */}
        {/*
        <div className="center-container">
          <div className="content-container">
            <Footer />
          </div>
        </div>
        */}
      </div>
      
      {/* Chatbot overlay (works great with blur) */}
      <div className="chatbot-container">
        <div className="content-container">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}

export default Home;