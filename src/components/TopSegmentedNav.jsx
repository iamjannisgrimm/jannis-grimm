import React, { useEffect, useMemo, useState } from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
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
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window === "undefined" ? "/" : window.location.pathname || "/",
  );
  const [activeKey, setActiveKey] = useState("home");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let previousY = window.scrollY;
    let frameId = 0;

    const updateVisibility = () => {
      frameId = 0;
      const currentY = window.scrollY;
      const isNearTop = currentY < 16;
      const isScrollingUp = currentY < previousY;

      setIsVisible(isNearTop);
      previousY = currentY;
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
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const homeSections = ["home", "overview", "highlights", "assistants", "contact"];
    let frameId = 0;

    const updateActiveKey = () => {
      frameId = 0;

      if ((window.location.pathname || "/") === "/timeline") {
        setActiveKey("timeline");
        return;
      }

      const viewportAnchor = window.innerHeight * 0.28;
      let nextActiveKey = "home";

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
        key: "home",
        label: "Home",
        iconOnly: true,
        onClick: () => {
          if (window.location.pathname !== "/") {
            navigateTo("/");
            window.setTimeout(() => scrollToSection("home"), 50);
            return;
          }
          scrollToSection("home");
        },
      },
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
      }`}
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
