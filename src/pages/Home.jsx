import React from "react";
import Timeline from "../components/timeline/Timeline";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Achievements from "../components/Achievements";
import Quotes from "../components/Quotes";
import Footer from "../components/Footer";

export function Home() {
  return (
    <div style={{
      width: "100%",
      overflowX: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: 0,
      padding: 0
    }}>
      {/* Hero */}
      <div className="center-container" style={{ width: "100%" }}>
        <div className="content-container">
          <ProfileHeader image="me/JannisGrimm.png" title="Engineer. Innovator. Leader" />
        </div>
      </div>

      {/* GitHub Contributions */}
      <div className="center-container" style={{ width: "100%", backgroundColor: "white", padding: "60px 0 0" }}>
        <div className="content-container">
          <GitHubContributions username="iamjannisgrimm" />
        </div>
      </div>

      {/* Stats + Quote */}
      <div className="center-container" style={{ width: "100%", padding: "48px 0 100px" }}>
        <div className="content-container">
          <Achievements />
          <Quotes />
        </div>
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Footer */}
      <div className="center-container" style={{ width: "100%" }}>
        <div className="content-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}
