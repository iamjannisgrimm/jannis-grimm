import React from "react";
import Timeline from "../components/timeline/Timeline";
import Footer from "../components/Footer";
import { navigateTo } from "../lib/navigation";

export default function TimelinePage() {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#ffffff",
      }}
    >
      <section
        id="timeline"
        className="center-container"
        style={{ width: "100%", padding: "72px 0 28px" }}
      >
        <div className="content-container" style={{ width: "100%" }}>
          <button
            type="button"
            onClick={() => navigateTo("/")}
            style={{
              border: "1px solid rgba(17,17,17,0.12)",
              background: "rgba(255,255,255,0.9)",
              color: "#111111",
              borderRadius: "999px",
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Back to home
          </button>

          <div style={{ marginTop: "28px", maxWidth: "860px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(17,17,17,0.48)",
              }}
            >
              Full timeline
            </p>
            <h1
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(2.8rem, 7vw, 5.4rem)",
                lineHeight: 0.94,
                letterSpacing: "-0.06em",
                color: "#111111",
                fontWeight: 800,
                fontFamily:
                  "SF Pro, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              The complete journey stays here.
            </h1>
            <p
              style={{
                margin: "20px 0 0",
                maxWidth: "62ch",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "rgba(17,17,17,0.68)",
              }}
            >
              Every role, product, and project remains accessible in the full
              horizontal timeline. The homepage now tells a tighter story, while
              this page keeps the entire sequence intact.
            </p>
          </div>
        </div>
      </section>

      <Timeline />

      <div className="center-container" style={{ width: "100%" }}>
        <div className="content-container">
          <Footer />
        </div>
      </div>
    </div>
  );
}
