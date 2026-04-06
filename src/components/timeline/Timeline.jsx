import React, { useEffect, useRef, useState } from "react";
import timelineData from "../../data/timeline-data";

const CARD_WIDTH = 680;
const TIMELINE_ANCHOR_TOP = 40;
const MOBILE_TIMELINE_ANCHOR_TOP = 50;
const TIMELINE_VIEWPORT_HEIGHT = "100dvh";
const MOBILE_SCROLL_MULTIPLIER = 1.5;

// Oldest → newest (the way time works)
const orderedData = [...timelineData].reverse();

const Timeline = () => {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const progressRef = useRef(0);
  const isAlignedRef = useRef(false);
  const isTouchTrackingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [progress, setProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState("#fff");
  const stickyAnchorTop = isMobile ? MOBILE_TIMELINE_ANCHOR_TOP : TIMELINE_ANCHOR_TOP;

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", updateIsMobile, { passive: true });
    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    const getMaxTranslate = () =>
      trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 0;
    const snapToAnchor = (anchorTop) => {
      if (!outerRef.current) return false;
      const offset = outerRef.current.getBoundingClientRect().top - anchorTop;
      if (Math.abs(offset) > 1) {
        window.scrollTo({ top: window.scrollY + offset, behavior: "auto" });
        return false;
      }
      return true;
    };
    const alignToAnchor = () => {
      snapToAnchor(TIMELINE_ANCHOR_TOP);
      isAlignedRef.current = true;
      return true;
    };

    const getCurrentBg = (p) => {
      const max = getMaxTranslate();
      if (max === 0) return "#fff";
      const translateX = p * max;
      const paddingLeft = window.innerWidth * 0.06;
      const cardIndex = Math.floor((translateX - paddingLeft + CARD_WIDTH / 2) / CARD_WIDTH);
      const idx = Math.min(Math.max(cardIndex, 0), orderedData.length - 1);
      return orderedData[idx]?.background || "#fff";
    };

    const applyProgress = (p) => {
      progressRef.current = p;
      const maxTranslate = getMaxTranslate();
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${p * maxTranslate}px)`;
      }
      const bg = getCurrentBg(p);
      if (stickyRef.current) {
        stickyRef.current.style.backgroundColor = bg;
      }
      setProgress(p);
      setCurrentBg(bg);
    };

    const consumeHorizontalScroll = (delta) => {
      if (!outerRef.current) return false;
      if (!isAlignedRef.current) {
        alignToAnchor();
      }

      const maxTranslate = getMaxTranslate();
      if (maxTranslate <= 0) return false;
      if (progressRef.current <= 0 && delta < 0) return false;
      if (progressRef.current >= 1 && delta > 0) return false;

      const next = Math.min(1, Math.max(0, progressRef.current + delta / maxTranslate));
      applyProgress(next);
      return true;
    };

    const consumeTouchHorizontalScroll = (delta) => {
      const maxTranslate = getMaxTranslate();
      if (maxTranslate <= 0) return false;
      if (progressRef.current <= 0 && delta < 0) return false;
      if (progressRef.current >= 1 && delta > 0) return false;

      const next = Math.min(1, Math.max(0, progressRef.current + delta / maxTranslate));
      applyProgress(next);
      return true;
    };

    const canConsumeWheelScroll = () => {
      if (!outerRef.current) return false;
      const rect = outerRef.current.getBoundingClientRect();
      return rect.top <= TIMELINE_ANCHOR_TOP && rect.bottom > 0;
    };

    const canConsumeTouchScroll = () => {
      if (!outerRef.current) return false;
      const rect = outerRef.current.getBoundingClientRect();
      return rect.top <= MOBILE_TIMELINE_ANCHOR_TOP && rect.bottom > 0;
    };

    // Snap progress to 0 when user scrolls back above the section
    const handleScroll = () => {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();
      if (rect.top > stickyAnchorTop + 1 || rect.bottom <= 0) {
        isAlignedRef.current = false;
      }
      if (rect.top > stickyAnchorTop && progressRef.current > 0) {
        applyProgress(0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Desktop: wheel
    const handleWheel = (e) => {
      if (!canConsumeWheelScroll()) return;
      if (!consumeHorizontalScroll(e.deltaY)) return;
      e.preventDefault();
    };

    // Mobile: touch
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      isTouchTrackingRef.current = true;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (!isTouchTrackingRef.current) return;
      if (!canConsumeTouchScroll()) return;
      const currentTouchY = e.touches[0].clientY;
      e.preventDefault();
      const deltaY = touchStartY - currentTouchY;
      const primaryDelta = deltaY * MOBILE_SCROLL_MULTIPLIER;

      if (Math.abs(primaryDelta) < 0.5) {
        touchStartY = currentTouchY;
        touchStartX = e.touches[0].clientX;
        return;
      }

      if (!consumeTouchHorizontalScroll(primaryDelta)) return;
      touchStartY = currentTouchY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      isTouchTrackingRef.current = false;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [stickyAnchorTop]);

  const isDarkBg = currentBg && currentBg !== "#fff" && currentBg !== "#ffffff" && currentBg !== "#FFFFFF";
  const chromeColor = isDarkBg ? "rgba(255,255,255,0.4)" : "#bbb";
  const progressBarBg = isDarkBg ? "rgba(255,255,255,0.15)" : "#eee";
  const progressBarFill = isDarkBg ? "rgba(255,255,255,0.8)" : "#000";

  return (
    <div
      ref={outerRef}
      style={{
        height: `calc(${TIMELINE_VIEWPORT_HEIGHT} + ${stickyAnchorTop}px)`,
        position: "relative",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        backgroundColor: currentBg,
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: stickyAnchorTop,
          height: TIMELINE_VIEWPORT_HEIGHT,
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: currentBg,
          transition: "background-color 0.4s ease",
        }}
      >
        {/* Section label */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "22px 0 14px", flexShrink: 0 }}>
          <p style={{
            fontSize: "11px",
            fontWeight: 600,
            color: chromeColor,
            margin: 0,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            transition: "color 0.4s ease",
          }}>
            Experience &amp; Projects
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", height: "1px", background: progressBarBg, flexShrink: 0, transition: "background 0.4s ease" }}>
          <div style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: progressBarFill,
            transition: "width 0.05s linear, background 0.4s ease",
          }} />
        </div>

        {/* Horizontal track — no gap so adjacent same-color cards share background */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            flex: 1,
            willChange: "transform",
            paddingLeft: "6vw",
          }}
        >
          {orderedData.map((item, index) => (
            <Card key={index} item={item} index={index} total={orderedData.length} />
          ))}
          <div style={{ width: "6vw", flexShrink: 0, backgroundColor: orderedData[orderedData.length - 1]?.background || "#fff" }} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ item, index, total }) => {
  const isDark = item.background && item.background !== "#FFFFFF" && item.background !== "#ffffff";
  const textColor = isDark ? "#fff" : "#000";
  const subColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)";
  const dividerColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";

  // Check if next card is also dark — if so, no border needed
  const nextItem = index < total - 1 ? null : null; // handled by background continuity
  const showRightBorder = index < total - 1;

  return (
    <div
      style={{
        width: `${CARD_WIDTH}px`,
        flexShrink: 0,
        height: "100%",
        backgroundColor: item.background || "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "36px 56px 40px",
        boxSizing: "border-box",
        position: "relative",
        borderRight: showRightBorder ? `1px solid ${dividerColor}` : "none",
      }}
    >
      {/* Large date — top of card */}
      <div style={{
        fontSize: "clamp(42px, 5vw, 68px)",
        fontWeight: 800,
        color: subColor,
        lineHeight: 1,
        marginBottom: "24px",
        letterSpacing: "-2px",
        fontVariantNumeric: "tabular-nums",
        transition: "color 0.3s ease",
      }}>
        {item.date}
      </div>

      {/* Icon + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
        {item.icon && (
          <img src={item.icon} alt="icon" style={{ width: "38px", height: "38px", objectFit: "contain", flexShrink: 0 }} />
        )}
        <h2 style={{
          fontSize: "clamp(22px, 2.6vw, 32px)",
          fontWeight: 800,
          color: textColor,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: "-0.4px",
        }}>
          {item.title}
        </h2>
      </div>

      {/* Subtitle */}
      <p style={{ fontSize: "14px", fontWeight: 600, color: subColor, margin: "0 0 20px 54px" }}>
        {item.subtitle}
      </p>

      {/* Divider */}
      <div style={{ height: "1px", background: dividerColor, marginBottom: "20px" }} />

      {/* Image */}
      {item.image && (
        <div style={{ marginBottom: "18px" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              maxHeight: "240px",
              objectFit: "contain",
              objectPosition: "left center",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Description */}
      <p style={{ fontSize: "15px", fontWeight: 500, color: textColor, margin: "0 0 6px 0", lineHeight: 1.65, flex: item.secondDescription ? "none" : 1 }}>
        {item.description}
      </p>
      {item.secondDescription && (
        <p style={{ fontSize: "13px", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", margin: "0 0 0 0", lineHeight: 1.65, flex: 1 }}>
          {item.secondDescription}
        </p>
      )}

      {/* Tech stack + link pinned to bottom */}
      <div style={{ marginTop: "auto", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {item.techStack && item.techStack.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {item.techStack.map((tech, i) => (
              <img key={i} src={tech} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            ))}
          </div>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: item.linkColor || textColor,
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              opacity: 0.75,
              display: "inline-block",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.75")}
          >
            Learn more →
          </a>
        )}
      </div>
    </div>
  );
};

export default Timeline;
