import React, { useEffect, useMemo, useState } from "react";
import { navigateTo } from "../lib/navigation";
import "./TopSegmentedNav.css";

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function animateWindowScroll(targetTop, duration = 420) {
  if (typeof window === "undefined") {
    return;
  }

  const startTop = window.scrollY;
  const distance = targetTop - startTop;

  if (Math.abs(distance) < 2) {
    window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
    return;
  }

  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = easeOutCubic(progress);
    window.scrollTo(0, startTop + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
  };

  window.requestAnimationFrame(tick);
}

function scrollToSection(sectionId) {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;
  animateWindowScroll(Math.max(0, absoluteTop - 24));
}

export default function TopSegmentedNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkSurface, setIsDarkSurface] = useState(false);
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window === "undefined" ? "/" : window.location.pathname || "/",
  );
  const [activeKey, setActiveKey] = useState("overview");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let frameId = 0;
    let idleTimeoutId = 0;

    const updateVisibility = () => {
      frameId = 0;
      const currentY = window.scrollY;
      const isNearTop = currentY < 16;

      if (idleTimeoutId) {
        window.clearTimeout(idleTimeoutId);
      }

      if (isNearTop) {
        setIsVisible(true);
        return;
      }

      setIsVisible(false);
      idleTimeoutId = window.setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    const requestTick = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateVisibility);
      }
    };

    const handlePopstate = () => {
      setCurrentPath(window.location.pathname || "/");
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("popstate", handlePopstate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (idleTimeoutId) {
        window.clearTimeout(idleTimeoutId);
      }
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const parseHexColor = (value) => {
      if (!value || typeof value !== "string") {
        return null;
      }

      const normalized = value.trim();
      const hex = normalized.startsWith("#") ? normalized.slice(1) : normalized;

      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16),
        };
      }

      if (hex.length === 6) {
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
        };
      }

      return null;
    };

    const getRelativeLuminance = ({ r, g, b }) => {
      const transform = (channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };

      const rr = transform(r);
      const gg = transform(g);
      const bb = transform(b);
      return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
    };

    const syncSurfaceTone = () => {
      const themeColor =
        document.querySelector("meta[name='theme-color']")?.getAttribute("content") ||
        getComputedStyle(document.documentElement).getPropertyValue("--timeline-app-background") ||
        "#ffffff";
      const rgb = parseHexColor(themeColor);
      if (!rgb) {
        setIsDarkSurface(false);
        return;
      }

      setIsDarkSurface(getRelativeLuminance(rgb) < 0.24);
    };

    let frameId = 0;
    const requestSync = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncSurfaceTone();
      });
    };

    const themeMeta = document.querySelector("meta[name='theme-color']");
    const observer =
      themeMeta instanceof HTMLElement
        ? new MutationObserver(requestSync)
        : null;

    if (observer && themeMeta) {
      observer.observe(themeMeta, {
        attributes: true,
        attributeFilter: ["content"],
      });
    }

    syncSurfaceTone();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      observer?.disconnect();
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const homeSections = ["overview", "highlights", "assistants", "contact"];
    let frameId = 0;

    const updateActiveKey = () => {
      frameId = 0;

      if ((window.location.pathname || "/") === "/timeline") {
        setActiveKey("timeline");
        return;
      }

      const viewportAnchor = window.innerHeight * 0.28;
      let nextActiveKey = "overview";

      for (const sectionId of homeSections) {
        const element = document.getElementById(sectionId);
        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        if (rect.top <= viewportAnchor) {
          nextActiveKey = sectionId;
        }
      }

      setActiveKey(nextActiveKey);
    };

    const requestTick = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateActiveKey);
      }
    };

    updateActiveKey();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    window.addEventListener("popstate", requestTick);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      window.removeEventListener("popstate", requestTick);
    };
  }, []);

  const items = useMemo(
    () => [
      {
        key: "overview",
        label: "Overview",
        onClick: () => {
          if (window.location.pathname !== "/") {
            navigateTo("/");
            window.setTimeout(() => scrollToSection("overview"), 50);
            return;
          }
          scrollToSection("overview");
        },
      },
      {
        key: "highlights",
        label: "Highlights",
        onClick: () => {
          if (window.location.pathname !== "/") {
            navigateTo("/");
            window.setTimeout(() => scrollToSection("highlights"), 50);
            return;
          }
          scrollToSection("highlights");
        },
      },
      {
        key: "assistants",
        label: "Team",
        onClick: () => {
          if (window.location.pathname !== "/") {
            navigateTo("/");
            window.setTimeout(() => scrollToSection("assistants"), 50);
            return;
          }
          scrollToSection("assistants");
        },
      },
      {
        key: "contact",
        label: "Connect",
        onClick: () => {
          if (window.location.pathname !== "/") {
            navigateTo("/");
            window.setTimeout(() => scrollToSection("contact"), 50);
            return;
          }
          scrollToSection("contact");
        },
      },
    ],
    [currentPath],
  );

  return (
    <div
      className={`top-segmented-nav ${
        isVisible ? "top-segmented-nav--visible" : "top-segmented-nav--hidden"
      } ${isDarkSurface ? "top-segmented-nav--dark" : "top-segmented-nav--light"}`}
    >
      <div className="top-segmented-nav__shell" role="navigation" aria-label="Primary">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`top-segmented-nav__item ${
              activeKey === item.key ? "top-segmented-nav__item--active" : ""
            } ${item.iconOnly ? "top-segmented-nav__item--iconOnly" : ""}`}
            onClick={item.onClick}
            aria-label={item.label}
          >
            {item.iconOnly ? (
              <HomeIcon className="top-segmented-nav__icon" aria-hidden="true" />
            ) : (
              <span>{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
