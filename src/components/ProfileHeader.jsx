import React, { useEffect, useState } from "react";

const ProfileHeader = ({ image, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imageSrc = /^https?:\/\//.test(image)
    ? image
    : `${import.meta.env.BASE_URL}${image}`;

  useEffect(() => {
    let isActive = true;
    const preloadImage = new Image();
    preloadImage.src = imageSrc;

    const revealImage = async () => {
      try {
        if (typeof preloadImage.decode === "function") {
          await preloadImage.decode();
        }
      } catch {
        // Ignore decode failures and reveal the already-loaded asset.
      }

      if (!isActive) {
        return;
      }
      setIsLoaded(true);
      requestAnimationFrame(() => {
        if (isActive) {
          setIsVisible(true);
        }
      });
    };

    if (preloadImage.complete) {
      revealImage();
      return () => {
        isActive = false;
      };
    }

    preloadImage.onload = revealImage;
    preloadImage.onerror = revealImage;

    return () => {
      isActive = false;
    };
  }, [imageSrc]);

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
        boxSizing: "border-box"
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "black",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 800,
          textAlign: "center",
          fontFamily: "SF Pro",
          letterSpacing: "-1px",
          padding: 0,
          margin: "0 0 30px 0",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {title.split(". ").map((part, i, arr) => (
          <span key={i} className="title-part">
            {part}{i < arr.length - 1 ? "." : ""}
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
            maxWidth: "400px",
            aspectRatio: "2131 / 2050",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            background: "white",
            backgroundImage: isLoaded ? `url("${imageSrc}")` : "none",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              opacity: isVisible ? 0 : 1,
              transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
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
  );
};

export default ProfileHeader;
