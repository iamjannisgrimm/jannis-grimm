import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import timelineData from "../../data/timeline-data";

const CARD_WIDTH = 680;
const TIMELINE_ANCHOR_TOP = 40;
const MOBILE_TIMELINE_ANCHOR_TOP = 50;
const TIMELINE_VIEWPORT_HEIGHT = "100dvh";
const MOBILE_TIMELINE_HEIGHT = "130dvh";

gsap.registerPlugin(ScrollTrigger);

const liveTimelineData =
  typeof window !== "undefined" && Array.isArray(window.__PORTFOLIO_TIMELINE_DATA__)
    ? window.__PORTFOLIO_TIMELINE_DATA__
    : timelineData;

// Oldest → newest so the latest item sits at the far end initially.
const orderedData = [...liveTimelineData].reverse();

function getDescriptionBlocks(item) {
  if (Array.isArray(item.descriptionBlocks) && item.descriptionBlocks.length > 0) {
    return item.descriptionBlocks
      .slice(0, 3)
      .map((block) => ({
        body: typeof block?.body === "string" ? block.body : "",
        style: block?.style === "light" ? "light" : "default",
      }))
      .filter((block) => block.body.trim());
  }

  return [
    item.description ? { body: item.description, style: "default" } : null,
    item.secondDescription ? { body: item.secondDescription, style: "light" } : null,
  ].filter(Boolean);
}

function MarkdownDescriptionBlock({ block, isDark, isMobile, topPadding = 0 }) {
  const isLight = block.style === "light";
  const color = isLight ? (isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)") : isDark ? "#fff" : "#000";

  return (
    <div
      style={{
        color,
        fontSize: isLight ? (isMobile ? "12px" : "13px") : isMobile ? "13px" : "15px",
        fontWeight: isLight ? 450 : 500,
        lineHeight: 1.65,
        margin: 0,
        paddingTop: topPadding,
        flex: "none",
      }}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
          ul: ({ children }) => <ul style={{ margin: "0 0 0 18px", padding: 0 }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ margin: "0 0 0 18px", padding: 0 }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: "2px 0" }}>{children}</li>,
          strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
              {children}
            </a>
          ),
        }}
      >
        {block.body}
      </ReactMarkdown>
    </div>
  );
}

function useImageReady(src) {
  const [isReady, setIsReady] = useState(() => !src);

  useEffect(() => {
    if (!src) {
      setIsReady(true);
      return;
    }

    let cancelled = false;
    const image = new Image();
    const markReady = () => {
      if (!cancelled) {
        setIsReady(true);
      }
    };

    setIsReady(false);
    image.onload = markReady;
    image.onerror = () => {
      if (!cancelled) {
        setIsReady(false);
      }
    };
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      markReady();
    }

    return () => {
      cancelled = true;
    };
  }, [src]);

  return isReady;
}

function TimelineImageSurface({
  src,
  alt,
  isDark,
  borderRadius,
  shellStyle,
  imageStyle,
}) {
  const [isReady, setIsReady] = useState(() => false);

  useEffect(() => {
    setIsReady(false);
  }, [src]);

  const shimmerBackground = isDark
    ? "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%)"
    : "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        background: shimmerBackground,
        backgroundSize: "200% 100%",
        animation: isReady ? "none" : "timeline-image-shimmer 1.4s ease-in-out infinite",
        ...shellStyle,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setIsReady(true)}
        onError={() => setIsReady(false)}
        style={{
          ...imageStyle,
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}

const Timeline = () => {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const previousProgressRef = useRef(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [progress, setProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState("#fff");
  const [isHeroChromeActive, setIsHeroChromeActive] = useState(true);
  const [scrollDistance, setScrollDistance] = useState(0);
  const stickyAnchorTop = isMobile ? MOBILE_TIMELINE_ANCHOR_TOP : TIMELINE_ANCHOR_TOP;
  const timelineViewportHeight = isMobile ? MOBILE_TIMELINE_HEIGHT : TIMELINE_VIEWPORT_HEIGHT;

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
      if (maxTranslate === 0 || !trackRef.current) return "#fff";

      const currentX = -maxTranslate + p * maxTranslate;
      const visibleStart = -currentX;
      const direction = p >= previousProgressRef.current ? 1 : -1;
      const edgePosition = direction >= 0
        ? visibleStart + 1
        : visibleStart + window.innerWidth - 1;
      const cards = Array.from(trackRef.current.children);

      const activeIndex = cards.findIndex((card) => {
        const start = card.offsetLeft;
        const end = start + card.offsetWidth;
        return edgePosition >= start && edgePosition < end;
      });

      if (activeIndex === -1) {
        return orderedData[direction >= 0 ? 0 : orderedData.length - 1]?.background || "#fff";
      }

      return orderedData[activeIndex]?.background || "#fff";
    };

    const getHeroChromeActive = (p) => {
      if (!trackRef.current) return false;
      const heroIndex = orderedData.findIndex((item) => item.isHero);
      if (heroIndex === -1) return false;
      if (p <= 0.001) return true;

      const direction = p >= previousProgressRef.current ? 1 : -1;
      if (direction >= 0) return false;

      const maxTranslate = getMaxTranslate();
      const currentX = -maxTranslate + p * maxTranslate;
      const visibleStart = -currentX;
      const visibleEnd = visibleStart + window.innerWidth;
      const heroCard = trackRef.current.children[heroIndex];

      if (!heroCard) return false;

      const heroStart = heroCard.offsetLeft;
      const heroEnd = heroStart + heroCard.clientWidth;
      return heroStart < visibleEnd && heroEnd > visibleStart;
    };

    const ctx = gsap.context(() => {
      const maxTranslate = getMaxTranslate();
      setScrollDistance(maxTranslate);
      gsap.set(trackRef.current, { x: -maxTranslate });

      gsap.to(trackRef.current, {
        x: 0,
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
            setIsHeroChromeActive(getHeroChromeActive(self.progress));
            previousProgressRef.current = self.progress;
          },
          onRefresh: (self) => {
            const bg = getCurrentBg(self.progress);
            setProgress(self.progress);
            setCurrentBg(bg);
            setIsHeroChromeActive(getHeroChromeActive(self.progress));
            previousProgressRef.current = self.progress;
          },
        },
      });
    }, outerRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [stickyAnchorTop]);

  const chromeBg = isHeroChromeActive ? "#fff" : currentBg;
  const isDarkBg = chromeBg && chromeBg !== "#fff" && chromeBg !== "#ffffff" && chromeBg !== "#FFFFFF";
  const chromeColor = isHeroChromeActive ? "rgba(0,0,0,0.5)" : isDarkBg ? "rgba(255,255,255,0.4)" : "#bbb";
  const progressBarBg = isHeroChromeActive ? "rgba(0,0,0,0.12)" : isDarkBg ? "rgba(255,255,255,0.15)" : "#eee";
  const progressBarFill = isHeroChromeActive ? "#000" : isDarkBg ? "rgba(255,255,255,0.8)" : "#000";

  return (
    <div
      ref={outerRef}
      style={{
        height: `calc(${timelineViewportHeight} + ${scrollDistance}px)`,
        position: "relative",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        backgroundColor: chromeBg,
      }}
    >
      <div
        ref={stickyRef}
        style={{
          height: `calc(${timelineViewportHeight} - ${stickyAnchorTop}px)`,
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: chromeBg,
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
            marginLeft: "auto",
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
  const isHero = Boolean(item.isHero);
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;
  const cardWidth = isHero ? "100vw" : isMobile ? "86vw" : `${CARD_WIDTH}px`;
  const shouldCropImage = item.title === "Synechron Inc" || item.title === "Arizona State University" || item.title === "Lufthansa";
  const descriptionBlocks = getDescriptionBlocks(item);
  const heroProductSource = isMobile ? item.productImageMobile || item.productImage : item.productImage;
  const heroBackgroundReady = useImageReady(isHero ? item.backgroundImage : "");

  const nextItem = index < total - 1 ? null : null;
  const showRightBorder = index < total - 1;

  if (isHero) {
    return (
      <div
        style={{
          width: cardWidth,
          flexShrink: 0,
          height: "100%",
          backgroundColor: item.background || "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: isMobile ? "28px 24px 24px" : "36px 56px 28px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          borderRight: showRightBorder ? `1px solid ${dividerColor}` : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: isHero ? 0 : "inherit",
            background: isDark
              ? "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%)"
              : "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)",
            backgroundSize: "200% 100%",
            animation: "timeline-image-shimmer 1.4s ease-in-out infinite",
            opacity: item.backgroundImage && !heroBackgroundReady ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: item.backgroundImage ? `url(${item.backgroundImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: item.backgroundImage ? (heroBackgroundReady ? 0.2 : 0) : 1,
            transition: "opacity 0.3s ease",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: item.backgroundImage
              ? "transparent"
              : "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        />

        <div style={{
          position: "absolute",
          top: isMobile ? "20px" : "28px",
          left: isMobile ? "20px" : "32px",
          zIndex: 1,
          fontSize: "clamp(28px, 3vw, 40px)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.28)",
          lineHeight: 1,
          letterSpacing: "-1px",
          fontVariantNumeric: "tabular-nums",
        }}>
          {item.date}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: isMobile ? "10px" : "12px",
            flex: 1,
            minHeight: isMobile ? "0" : "240px",
            paddingTop: isMobile ? "0" : "40px",
            marginTop: isMobile ? "-160px" : "0",
          }}
        >
          <div style={{ maxWidth: isMobile ? "320px" : "420px", width: "100%", textAlign: "center", marginBottom: isMobile ? "8px" : "20px" }}>
            <h2 style={{
              fontSize: isMobile ? "clamp(38px, 10vw, 52px)" : "clamp(44px, 5vw, 76px)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              lineHeight: 0.95,
              letterSpacing: "-2px",
            }}>
              {item.title}
            </h2>

            <div
              style={{
                margin: isMobile ? "12px auto 0 auto" : "18px auto 0 auto",
                maxWidth: isMobile ? "300px" : "430px",
                display: "grid",
                gap: isMobile ? "8px" : "10px",
              }}
            >
              {descriptionBlocks.map((block, blockIndex) => (
                <MarkdownDescriptionBlock key={blockIndex} block={block} isDark isMobile={isMobile} />
              ))}
            </div>
          </div>

          {heroProductSource ? (
            <TimelineImageSurface
              src={heroProductSource}
              alt={item.title}
              isDark
              borderRadius={isMobile ? "22px" : "26px"}
              shellStyle={{
                width: isMobile ? "72%" : "68%",
                minHeight: isMobile ? "340px" : "420px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              imageStyle={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
                position: "relative",
                zIndex: 1,
              }}
            />
          ) : (
            <div
              style={{
                width: "62%",
                maxWidth: "520px",
                aspectRatio: "1.1 / 1",
                borderRadius: "28px",
                border: "1px dashed rgba(255,255,255,0.32)",
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Product Image Placeholder
            </div>
          )}

          {item.appStoreBadge && (
            <a
              href={item.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: isMobile ? "12px" : "28px",
                background: "rgba(255,255,255,0.96)",
                borderRadius: "12px",
                padding: "3px 18px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              <img
                src={item.appStoreBadge}
                alt="Download on the App Store"
                  style={{
                    display: "block",
                    height: "36px",
                  width: "auto",
                }}
              />
            </a>
          )}

          {item.website && (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(255,255,255,0.56)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "0.04em",
                marginTop: isMobile ? "2px" : "0",
              }}
            >
              seemeai.app
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: cardWidth,
        flexShrink: 0,
        height: "100%",
        backgroundColor: item.background || "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: isMobile ? "flex-start" : "center",
        padding: isMobile ? "32px 20px 28px" : "36px 56px 40px",
        boxSizing: "border-box",
        position: "relative",
        borderRight: showRightBorder ? `1px solid ${dividerColor}` : "none",
      }}
    >
      <div style={{
        fontSize: isMobile ? "clamp(30px, 8vw, 42px)" : "clamp(42px, 5vw, 68px)",
        fontWeight: 800,
        color: subColor,
        lineHeight: 1,
        marginBottom: isMobile ? "16px" : "24px",
        letterSpacing: isMobile ? "-1px" : "-2px",
        fontVariantNumeric: "tabular-nums",
        transition: "color 0.3s ease",
      }}>
        {item.date}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "12px", marginBottom: "6px" }}>
        {item.icon && (
          <img src={item.icon} alt="icon" style={{ width: isMobile ? "30px" : "38px", height: isMobile ? "30px" : "38px", objectFit: "contain", flexShrink: 0 }} />
        )}
        <h2 style={{
          fontSize: isMobile ? "clamp(20px, 5vw, 26px)" : "clamp(22px, 2.6vw, 32px)",
          fontWeight: 800,
          color: textColor,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: "-0.4px",
        }}>
          {item.title}
        </h2>
      </div>

      <p style={{ fontSize: isMobile ? "12px" : "14px", fontWeight: 600, color: subColor, margin: isMobile ? "0 0 14px 40px" : "0 0 20px 54px" }}>
        {item.subtitle}
      </p>

      <div style={{ height: "1px", background: dividerColor, marginBottom: isMobile ? "14px" : "20px" }} />

      {item.image && (
        <div style={{ marginBottom: isMobile ? "14px" : "18px" }}>
          <TimelineImageSurface
            src={item.image}
            alt={item.title}
            isDark={isDark}
            borderRadius={isMobile ? "16px" : "18px"}
            shellStyle={{
              width: "100%",
              height: isMobile ? "180px" : "240px",
            }}
            imageStyle={{
              width: "100%",
              height: "100%",
              objectFit: shouldCropImage ? "cover" : "contain",
              objectPosition: shouldCropImage ? "center" : "center",
              display: "block",
              position: "relative",
              zIndex: 1,
              borderRadius: shouldCropImage ? (isMobile ? "16px" : "18px") : "0px",
            }}
          />
          <div style={{ height: "1px", background: dividerColor, marginTop: isMobile ? "14px" : "20px" }} />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: isMobile ? "3px" : "20px",
          alignContent: "start",
          alignItems: "start",
          gridAutoRows: "max-content",
          flex: isMobile ? "none" : 1,
        }}
      >
        {descriptionBlocks.map((block, blockIndex) => (
          <MarkdownDescriptionBlock
            key={blockIndex}
            block={block}
            isDark={isDark}
            isMobile={isMobile}
            topPadding={blockIndex === 0 ? (isMobile ? 3 : 5) : 0}
          />
        ))}
      </div>

      <div style={{ marginTop: isMobile ? "0" : "auto", paddingTop: isMobile ? "14px" : "20px", display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "12px", position: isMobile ? "absolute" : "static", left: isMobile ? "20px" : "auto", right: isMobile ? "20px" : "auto", bottom: isMobile ? "240px" : "auto" }}>
        {item.techStack && item.techStack.length > 0 && (
          <div style={{ display: "flex", gap: isMobile ? "8px" : "10px", flexWrap: "wrap" }}>
            {item.techStack.map((tech, i) => (
              <img key={i} src={tech} alt="" style={{ width: isMobile ? "18px" : "20px", height: isMobile ? "18px" : "20px", objectFit: "contain" }} />
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
              fontSize: isMobile ? "12px" : "13px",
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
