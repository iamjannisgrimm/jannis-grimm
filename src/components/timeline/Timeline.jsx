import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import timelineData from "../../data/timeline-data";

const CARD_WIDTH = 680;
const TIMELINE_ANCHOR_TOP = 40;
const MOBILE_TIMELINE_ANCHOR_TOP = 50;
const TIMELINE_VIEWPORT_HEIGHT = "100dvh";

gsap.registerPlugin(ScrollTrigger);

// Oldest → newest (the way time works)
const orderedData = [...timelineData].reverse();

const Timeline = () => {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [progress, setProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState("#fff");
  const [scrollDistance, setScrollDistance] = useState(0);
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

  useLayoutEffect(() => {
    if (!outerRef.current || !trackRef.current || !stickyRef.current) return;

    const getMaxTranslate = () =>
      Math.max(trackRef.current.scrollWidth - window.innerWidth, 0);

    const getCurrentBg = (p) => {
      const maxTranslate = getMaxTranslate();
      if (maxTranslate === 0) return "#fff";
      const translateX = p * maxTranslate;
      const paddingLeft = window.innerWidth * 0.06;
      const cardIndex = Math.floor((translateX - paddingLeft + CARD_WIDTH / 2) / CARD_WIDTH);
      const idx = Math.min(Math.max(cardIndex, 0), orderedData.length - 1);
      return orderedData[idx]?.background || "#fff";
    };

    const ctx = gsap.context(() => {
      const maxTranslate = getMaxTranslate();
      setScrollDistance(maxTranslate);
      gsap.set(trackRef.current, { x: 0 });

      gsap.to(trackRef.current, {
        x: () => -getMaxTranslate(),
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          pin: stickyRef.current,
          start: () => `top top+=${stickyAnchorTop}`,
          end: () => `+=${getMaxTranslate()}`,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const bg = getCurrentBg(self.progress);
            setProgress(self.progress);
            setCurrentBg(bg);
          },
          onRefresh: (self) => {
            const bg = getCurrentBg(self.progress);
            setProgress(self.progress);
            setCurrentBg(bg);
          },
        },
      });
    }, outerRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [stickyAnchorTop]);

  const isDarkBg = currentBg && currentBg !== "#fff" && currentBg !== "#ffffff" && currentBg !== "#FFFFFF";
  const chromeColor = isDarkBg ? "rgba(255,255,255,0.4)" : "#bbb";
  const progressBarBg = isDarkBg ? "rgba(255,255,255,0.15)" : "#eee";
  const progressBarFill = isDarkBg ? "rgba(255,255,255,0.8)" : "#000";

  return (
    <div
      ref={outerRef}
      style={{
        height: `calc(${TIMELINE_VIEWPORT_HEIGHT} + ${scrollDistance}px)`,
        position: "relative",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        backgroundColor: currentBg,
      }}
    >
      <div
        ref={stickyRef}
        style={{
          height: `calc(${TIMELINE_VIEWPORT_HEIGHT} - ${stickyAnchorTop}px)`,
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: currentBg,
          transition: "background-color 0.4s ease",
        }}
      >
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

        <div style={{ width: "100%", height: "1px", background: progressBarBg, flexShrink: 0, transition: "background 0.4s ease" }}>
          <div style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: progressBarFill,
            transition: "width 0.05s linear, background 0.4s ease",
          }} />
        </div>

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

  const nextItem = index < total - 1 ? null : null;
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

      <p style={{ fontSize: "14px", fontWeight: 600, color: subColor, margin: "0 0 20px 54px" }}>
        {item.subtitle}
      </p>

      <div style={{ height: "1px", background: dividerColor, marginBottom: "20px" }} />

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

      <p style={{ fontSize: "15px", fontWeight: 500, color: textColor, margin: "0 0 6px 0", lineHeight: 1.65, flex: item.secondDescription ? "none" : 1 }}>
        {item.description}
      </p>
      {item.secondDescription && (
        <p style={{ fontSize: "13px", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", margin: "0 0 0 0", lineHeight: 1.65, flex: 1 }}>
          {item.secondDescription}
        </p>
      )}

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
