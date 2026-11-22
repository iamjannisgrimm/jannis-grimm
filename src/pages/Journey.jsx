import React, { useEffect } from "react";
import Timeline from "../components/timeline/Timeline";

export function Journey({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      {/* Fixed nav overlay */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 28px",
          height: 56,
          background: "rgba(10,10,10,0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            padding: "6px 0",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
        >
          ← Back
        </button>

        <div
          style={{
            width: 1,
            height: 16,
            background: "rgba(255,255,255,0.15)",
          }}
        />

        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Full Journey
        </span>
      </nav>

      {/* Timeline pushed below fixed nav */}
      <div style={{ paddingTop: 56 }}>
        <Timeline />
      </div>
    </div>
  );
}
