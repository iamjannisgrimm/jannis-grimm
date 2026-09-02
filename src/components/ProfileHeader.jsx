/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const ProfileHeader = ({ image, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );
  const imageSrc = /^https?:\/\//.test(image) || image.startsWith("/")
    ? image
    : `${import.meta.env.BASE_URL}${image}`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const revealImage = () => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        padding: "80px 0",
        margin: 0,
        textAlign: "center",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes hero-chevron-breathe {
            0%, 100% {
              opacity: 0.38;
              transform: translate3d(-50%, 0, 0);
            }
            50% {
              opacity: 0.58;
              transform: translate3d(-50%, 4px, 0);
            }
          }
        `}
      </style>

      <div
        style={{
          width: "100%",
          transform: `translate3d(0, ${isMobile ? "-18px" : "-26px"}, 0)`,
        }}
      >
        <h1
          style={{
            display: isMobile ? "flex" : "block",
            flexDirection: isMobile ? "column" : undefined,
            alignItems: isMobile ? "center" : undefined,
            gap: isMobile ? "calc(0.14em + 10px)" : 0,
            color: "black",
            fontSize: isMobile
              ? "clamp(2.2rem, 8vw, 3.6rem)"
              : "clamp(2.2rem, calc(4vw - 0.2rem), 3.3rem)",
            fontWeight: 800,
            lineHeight: 0.93,
            textAlign: "center",
            fontFamily: "SF Pro",
            letterSpacing: "-0.06em",
            padding: 0,
            margin: "0 auto 30px",
            width: "100%",
            maxWidth: isMobile ? "800px" : "1100px",
            whiteSpace: isMobile ? "normal" : "nowrap",
          }}
        >
          {title.split(". ").map((part, i, arr) => (
            <span
              key={i}
              className="title-part"
              style={{
                display: isMobile ? "block" : "inline-block",
                marginRight: isMobile ? 0 : (i < arr.length - 1 ? "0.2em" : 0),
              }}
            >
              {part}{"."}
            </span>
          ))}
        </h1>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          margin: 0,
          padding: 0,
          position: "relative",
        }}>
          <div
            style={{
              width: "90%",
              maxWidth: isMobile ? "400px" : "470px",
              aspectRatio: "2131 / 2050",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              background: "white",
            }}
          >
            <img
              src={imageSrc}
              alt="Jannis Grimm"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={revealImage}
              onError={revealImage}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "white",
                opacity: isVisible ? 0 : 1,
                transition: "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                pointerEvents: "none",
              }}
            />
          </div>
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to bottom, transparent, white)",
            borderRadius: "0 0 12px 12px",
            pointerEvents: "none"
          }} />
        </div>
      </div>

      <svg
        width={isMobile ? "84" : "112"}
        height="24"
        viewBox="0 0 112 24"
        aria-hidden="true"
        focusable="false"
        style={{
          position: "absolute",
          left: "50%",
          bottom: isMobile ? "32px" : "42px",
          overflow: "visible",
          animation: "hero-chevron-breathe 2.8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        <path
          d="M36 8 L56 18 L76 8"
          fill="none"
          stroke="rgba(0,0,0,0.24)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
          }}
        />
      </svg>
    </div>
  );
};

export default ProfileHeader;
