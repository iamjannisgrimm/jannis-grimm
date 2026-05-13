import { useEffect, useState } from "react";
import GitHubContributions from "../components/GitHubContributions";
import ProfileHeader from "../components/ProfileHeader";
import Achievements from "../components/Achievements";
import Quotes from "../components/Quotes";
import ConnectSection from "../components/ConnectSection";
import Footer from "../components/Footer";
import FeaturedProjectsStory from "../components/featured/FeaturedProjectsStory";
import EventPlannerStory from "../components/featured/EventPlannerStory";
import AssistantsShowcase from "../components/featured/AssistantsShowcase";

const SNAP_SECTION_IDS = ["home", "overview"];
const SNAP_OFFSET = 92;
const SNAP_LOCK_MS = 40;
const SNAP_IDLE_MS = 48;
const SNAP_ANIMATION_MS = 100;
const SNAP_DIRECTION_THRESHOLD = 10;
const SNAP_GESTURE_COMMIT_THRESHOLD = 12;

export function Home() {
  const [githubContributionTotal, setGithubContributionTotal] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add("home-scroll-snap");
    document.body.classList.add("home-scroll-snap");

    let isProgrammaticSnap = false;
    let snapLockUntil = 0;
    let snapTimeout = 0;
    let animationFrameId = 0;
    let animationToken = 0;
    let lastInputAt = 0;
    let lastInputDirection = 0;
    let touchStartY = 0;
    let touchLastY = 0;
    let lastSnappedTarget = null;
    let gestureTravel = 0;
    let gestureActive = false;
    let gestureBaseTarget = null;
    const previousSafeAreaBarsAllowed = window.__portfolioTimelineSafeAreaBarsAllowed;
    const previousTimelineBackgroundSetter = window.__PORTFOLIO_SET_TIMELINE_BACKGROUND;
    const previousMobileChromeSetter = window.__PORTFOLIO_APPLY_MOBILE_CHROME_COLOR;
    const previousMobileChromeSync = window.__PORTFOLIO_SYNC_MOBILE_CHROME;
    const previousThemeColorContent =
      document.querySelector("meta[name='theme-color']")?.getAttribute("content") || "#ffffff";

    const ensureMobileChromeFills = () => {
      ["top", "bottom"].forEach((placement) => {
        if (document.querySelector(`.portfolio-mobile-chrome-fill--${placement}`)) {
          return;
        }

        const fill = document.createElement("div");
        fill.className = `portfolio-mobile-chrome-fill portfolio-mobile-chrome-fill--${placement}`;
        fill.setAttribute("aria-hidden", "true");
        document.body.appendChild(fill);
      });
    };

    const getMobileChromeSpec = (value) => {
      if (value && typeof value === "object") {
        const theme = value.theme || value.color || value.top || "#ffffff";
        const top = value.top || theme;
        const bottom = value.bottom || theme;
        return { theme, top, bottom };
      }

      const theme = value || "#ffffff";
      return { theme, top: theme, bottom: theme };
    };

    const readMobileChromeSpec = (element) => {
      if (!(element instanceof HTMLElement)) {
        return getMobileChromeSpec("#ffffff");
      }

      const theme = element.getAttribute("data-mobile-chrome-color") || "#ffffff";
      return getMobileChromeSpec({
        theme,
        top: element.getAttribute("data-mobile-chrome-top") || theme,
        bottom: element.getAttribute("data-mobile-chrome-bottom") || theme,
      });
    };

    const getMobileChromeKey = (spec) => `${spec.theme}|${spec.top}|${spec.bottom}`;

    const isFooterBackgroundActive = () => {
      const footer = document.querySelector(".portfolio-footer");
      if (!(footer instanceof HTMLElement)) {
        return false;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const footerRect = footer.getBoundingClientRect();
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const isNearDocumentEnd = window.scrollY + viewportHeight >= documentHeight - 2;

      return footerRect.top <= viewportHeight || isNearDocumentEnd;
    };

    const applyFooterBackgroundState = () => {
      const isActive = isFooterBackgroundActive();
      document.documentElement.classList.toggle("portfolio-footer-background-active", isActive);
      document.body.classList.toggle("portfolio-footer-background-active", isActive);

      if (!isActive) {
        return false;
      }

      document.documentElement.style.setProperty("--portfolio-overscroll-background", "#0d1117");
      document.body.style.setProperty("--portfolio-overscroll-background", "#0d1117");
      document.documentElement.style.backgroundColor = "#0d1117";
      document.body.style.backgroundColor = "#0d1117";

      const root = document.getElementById("root");
      if (root instanceof HTMLElement) {
        root.style.backgroundColor = "#0d1117";
      }

      return true;
    };

    const applyMobileChromeColor = (color) => {
      const chromeSpec = getMobileChromeSpec(color);
      const nextColor = chromeSpec.top;
      const pageCanvasColor = chromeSpec.bottom;
      const themeColor = document.querySelector("meta[name='theme-color']");
      if (themeColor) {
        if (themeColor.getAttribute("content") !== nextColor) {
          themeColor.setAttribute("content", nextColor);
        }
      }

      window.__portfolioTimelineSafeAreaBarsAllowed = false;
      document.documentElement.style.setProperty("--timeline-app-background", pageCanvasColor);
      document.body.style.setProperty("--timeline-app-background", pageCanvasColor);
      document.documentElement.style.setProperty("--portfolio-overscroll-background", pageCanvasColor);
      document.body.style.setProperty("--portfolio-overscroll-background", pageCanvasColor);
      document.documentElement.style.setProperty("--app-top-chrome", nextColor);
      document.body.style.setProperty("--app-top-chrome", nextColor);
      document.documentElement.style.setProperty("--portfolio-mobile-chrome", nextColor);
      document.body.style.setProperty("--portfolio-mobile-chrome", nextColor);
      document.documentElement.style.setProperty("--portfolio-mobile-chrome-top", chromeSpec.top);
      document.body.style.setProperty("--portfolio-mobile-chrome-top", chromeSpec.top);
      document.documentElement.style.setProperty("--portfolio-mobile-chrome-bottom", chromeSpec.bottom);
      document.body.style.setProperty("--portfolio-mobile-chrome-bottom", chromeSpec.bottom);
      document.documentElement.classList.remove("timeline-app-background-active");
      document.body.classList.remove("timeline-app-background-active");
      document.documentElement.style.backgroundColor = pageCanvasColor;
      document.body.style.backgroundColor = pageCanvasColor;

      const root = document.getElementById("root");
      if (root instanceof HTMLElement) {
        root.style.backgroundColor = pageCanvasColor;
      }

      applyFooterBackgroundState();

      document.querySelectorAll(".timeline-safe-area-fill").forEach((element) => {
        if (!(element instanceof HTMLElement)) {
          return;
        }

        element.style.opacity = "0";
        element.style.background = pageCanvasColor;
      });

      ensureMobileChromeFills();
      document.querySelectorAll(".portfolio-mobile-chrome-fill").forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.background = element.classList.contains("portfolio-mobile-chrome-fill--bottom")
            ? chromeSpec.bottom
            : chromeSpec.top;
        }
      });
    };
    let activeMobileChromeColor = getMobileChromeSpec("#ffffff");
    let mobileChromeFrame = 0;

    const getActiveSectionChromeColor = () => {
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const visibleTop = 0;
      const visibleHeight = viewportHeight;
      const visibleBottom = viewportHeight;
      const visibleCenter = viewportHeight * 0.5;
      const probeX = viewportWidth * 0.5;
      const topProbeY = 1;
      const centerProbeY = Math.max(1, Math.min(viewportHeight - 1, visibleCenter));
      const bottomProbeY = Math.max(1, Math.min(viewportHeight - 1, visibleBottom - 1));
      const specAtPoint = (x, y) =>
        document
          .elementsFromPoint(x, y)
          .map((element) => element.closest?.("[data-mobile-chrome-color]"))
          .find((element) => element instanceof HTMLElement);
      const topSection = specAtPoint(probeX, topProbeY);
      const centerSection = specAtPoint(probeX, centerProbeY);
      const bottomSection = specAtPoint(probeX, bottomProbeY);
      const pointColor = centerSection;

      if (topSection || bottomSection) {
        const topSpec = readMobileChromeSpec(topSection || pointColor || bottomSection);
        const bottomSpec = readMobileChromeSpec(bottomSection || pointColor || topSection);

        return getMobileChromeSpec({
          theme: topSpec.top,
          top: topSpec.top,
          bottom: bottomSpec.bottom,
        });
      }

      const centerColor = document
        .elementsFromPoint(probeX, centerProbeY)
        .map((element) => element.closest?.("[data-mobile-chrome-color]"))
        .find((element) => element instanceof HTMLElement);

      if (centerColor) {
        return readMobileChromeSpec(centerColor);
      }

      const sections = Array.from(
        document.querySelectorAll("[data-mobile-chrome-color]"),
      ).filter((element) => element instanceof HTMLElement);

      let bestColor = getMobileChromeSpec("#ffffff");
      let bestScore = -1;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleY = Math.max(0, Math.min(rect.bottom, visibleBottom) - Math.max(rect.top, visibleTop));
        const visibleX = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
        if (visibleY <= 0 || visibleX <= 0) {
          return;
        }

        const centerBonus = rect.top <= visibleCenter && rect.bottom >= visibleCenter ? visibleHeight : 0;
        const score = visibleY * visibleX + centerBonus;
        if (score > bestScore) {
          bestScore = score;
          bestColor = readMobileChromeSpec(section);
        }
      });

      return bestColor;
    };

    const syncMobileChromeColor = () => {
      const pageCanvasColor = getActiveSectionChromeColor();

      if (getMobileChromeKey(pageCanvasColor) !== getMobileChromeKey(activeMobileChromeColor)) {
        activeMobileChromeColor = pageCanvasColor;
      }
      applyMobileChromeColor(activeMobileChromeColor);
    };

    const requestMobileChromeSync = () => {
      if (mobileChromeFrame) {
        return;
      }

      mobileChromeFrame = window.requestAnimationFrame(() => {
        mobileChromeFrame = 0;
        syncMobileChromeColor();
      });
    };

    syncMobileChromeColor();
    applyFooterBackgroundState();
    window.__PORTFOLIO_SET_TIMELINE_BACKGROUND = () => {
      applyMobileChromeColor(activeMobileChromeColor);
    };
    window.__PORTFOLIO_APPLY_MOBILE_CHROME_COLOR = applyMobileChromeColor;
    window.__PORTFOLIO_SYNC_MOBILE_CHROME = requestMobileChromeSync;

    const getSections = () =>
      SNAP_SECTION_IDS
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const getSnapAnchor = (section) =>
      section.querySelector("[data-snap-anchor='center']") || section;

    const getDocumentTop = (element) => {
      let top = 0;
      let current = element;

      while (current instanceof HTMLElement) {
        top += current.offsetTop;
        current = current.offsetParent;
      }

      return top;
    };

    const getSectionTop = (section) => {
      const anchor = getSnapAnchor(section);
      const snapMode = anchor.getAttribute("data-snap-anchor") || "center";
      const snapBaseOffset = Number(anchor.getAttribute("data-snap-base-offset") || SNAP_OFFSET);
      const snapOffsetAdjustment = Number(anchor.getAttribute("data-snap-offset") || 0);
      const isCardAnchor = anchor.closest("[data-page-snap='card']") || anchor.getAttribute("data-page-snap") === "card";
      const rect = anchor.getBoundingClientRect();
      const absoluteTop = isCardAnchor ? getDocumentTop(anchor) : window.scrollY + rect.top;

      if (snapMode === "top") {
        return Math.max(0, absoluteTop - snapBaseOffset + snapOffsetAdjustment);
      }

      const visibleTop = SNAP_OFFSET;
      const visibleHeight = window.innerHeight - visibleTop;
      const targetTop = absoluteTop + rect.height / 2 - (visibleTop + visibleHeight / 2);

      return Math.max(0, targetTop + snapOffsetAdjustment);
    };

    const getTargetTop = (element) => getSectionTop(element);

    const getClosestSection = (sections) => {
      const currentY = window.scrollY;

      return sections.reduce((bestSection, section) => {
        if (!bestSection) {
          return section;
        }

      const sectionTop = getTargetTop(section);
      const bestTop = getTargetTop(bestSection);
        return Math.abs(sectionTop - currentY) < Math.abs(bestTop - currentY)
          ? section
          : bestSection;
      }, null);
    };

    const isWithinTopSnapRange = () => {
      const sections = getSections();
      const overviewSection = sections.find((section) => section.id === "overview");
      if (!overviewSection) {
        return false;
      }

      const overviewTop = getTargetTop(overviewSection);
      return window.scrollY <= overviewTop + window.innerHeight * 0.35;
    };

    const easeOutCubic = (value) => 1 - (1 - value) ** 3;

    const finishSnap = () => {
      isProgrammaticSnap = false;
      snapLockUntil = Date.now() + SNAP_LOCK_MS;
      gestureTravel = 0;
      gestureActive = false;
      gestureBaseTarget = null;
      lastInputDirection = 0;
    };

    const cancelSnapAnimation = () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      if (snapTimeout) {
        window.clearTimeout(snapTimeout);
        snapTimeout = 0;
      }
      animationToken += 1;
      isProgrammaticSnap = false;
      snapLockUntil = 0;
    };

    const ensureGestureBaseTarget = () => {
      if (gestureBaseTarget) {
        return gestureBaseTarget;
      }

      const sections = getSections();
      if (sections.length === 0) {
        return null;
      }

      gestureBaseTarget =
        lastSnappedTarget && sections.includes(lastSnappedTarget)
          ? lastSnappedTarget
          : getClosestSection(sections);

      return gestureBaseTarget;
    };

    const animateScrollTo = (targetTop) => {
      const startTop = window.scrollY;
      const distance = targetTop - startTop;

      if (Math.abs(distance) < 2) {
        window.scrollTo(0, targetTop);
        finishSnap();
        return;
      }

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      animationToken += 1;
      const token = animationToken;
      const startTime = performance.now();

      const tick = (now) => {
        if (token !== animationToken) {
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / SNAP_ANIMATION_MS);
        const eased = easeOutCubic(progress);
        const nextTop = startTop + distance * eased;

        window.scrollTo(0, nextTop);

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(tick);
          return;
        }

        window.scrollTo(0, targetTop);
        animationFrameId = 0;
        finishSnap();
      };

      animationFrameId = window.requestAnimationFrame(tick);
    };

    const snapToSection = (targetSection) => {
      if (isProgrammaticSnap || !targetSection) {
        return;
      }

      const currentTop = window.scrollY;
      const targetTop = getSectionTop(targetSection);

      if (Math.abs(targetTop - currentTop) < 12) {
        return;
      }

      isProgrammaticSnap = true;
      snapLockUntil = Date.now() + SNAP_LOCK_MS;
      lastSnappedTarget = targetSection;
      animateScrollTo(targetTop);
    };

    const maybeSnapNearestSection = () => {
      const sections = getSections();
      if (sections.length === 0) {
        return;
      }

      if (Date.now() - lastInputAt < SNAP_IDLE_MS) {
        scheduleSnap();
        return;
      }

      if (isProgrammaticSnap || Date.now() < snapLockUntil) {
        return;
      }

      if (!isWithinTopSnapRange()) {
        gestureActive = false;
        gestureBaseTarget = null;
        gestureTravel = 0;
        lastInputDirection = 0;
        return;
      }

      const baseTarget = ensureGestureBaseTarget() || getClosestSection(sections);
      let targetElement = baseTarget;

      if (!targetElement) {
        return;
      }

      const direction =
        lastInputDirection !== 0
          ? lastInputDirection
          : gestureTravel > 0
            ? 1
            : gestureTravel < 0
              ? -1
              : 0;

      const baseIndex = sections.indexOf(baseTarget);
      if (
        direction !== 0 &&
        Math.abs(gestureTravel) >= SNAP_GESTURE_COMMIT_THRESHOLD &&
        baseIndex >= 0
      ) {
        const adjacentIndex =
          direction > 0
            ? Math.min(sections.length - 1, baseIndex + 1)
            : Math.max(0, baseIndex - 1);
        targetElement = sections[adjacentIndex] || baseTarget;
      }

      const targetTop = getTargetTop(targetElement);
      if (Math.abs(targetTop - window.scrollY) < 18) {
        lastSnappedTarget = targetElement;
        gestureActive = false;
        gestureBaseTarget = null;
        lastInputDirection = 0;
        gestureTravel = 0;
        return;
      }

      snapToSection(targetElement);
      lastInputDirection = 0;
    };

    const scheduleSnap = () => {
      if (snapTimeout) {
        window.clearTimeout(snapTimeout);
      }

      const delay = Math.max(0, SNAP_IDLE_MS - (Date.now() - lastInputAt));
      snapTimeout = window.setTimeout(() => {
        maybeSnapNearestSection();
      }, delay);
    };

    const handleScroll = () => {
      applyFooterBackgroundState();
      requestMobileChromeSync();
      if (isProgrammaticSnap || !gestureActive) {
        return;
      }
      scheduleSnap();
    };

    const handleWheel = (event) => {
      lastInputAt = Date.now();
      requestMobileChromeSync();
      if (!gestureActive) {
        gestureActive = true;
        gestureBaseTarget = null;
        gestureTravel = 0;
        lastInputDirection = 0;
        ensureGestureBaseTarget();
      }
      gestureTravel += event.deltaY;
      if (Math.abs(event.deltaY) >= SNAP_DIRECTION_THRESHOLD) {
        lastInputDirection = event.deltaY > 0 ? 1 : -1;
      }
      cancelSnapAnimation();
      scheduleSnap();
    };

    const handleTouchStart = (event) => {
      lastInputAt = Date.now();
      requestMobileChromeSync();
      touchStartY = event.touches?.[0]?.clientY || 0;
      touchLastY = touchStartY;
      gestureActive = true;
      gestureBaseTarget = null;
      lastInputDirection = 0;
      gestureTravel = 0;
      ensureGestureBaseTarget();
      cancelSnapAnimation();
    };

    const handleTouchMove = (event) => {
      lastInputAt = Date.now();
      requestMobileChromeSync();
      const nextY = event.touches?.[0]?.clientY || touchLastY;
      const delta = touchLastY - nextY;
      gestureTravel += delta;
      if (Math.abs(delta) >= 8) {
        lastInputDirection = delta > 0 ? 1 : -1;
      }
      touchLastY = nextY;
      cancelSnapAnimation();
      scheduleSnap();
    };

    const handleTouchEnd = () => {
      lastInputAt = Date.now();
      requestMobileChromeSync();
      const totalDelta = touchStartY - touchLastY;
      if (Math.abs(totalDelta) >= SNAP_DIRECTION_THRESHOLD) {
        lastInputDirection = totalDelta > 0 ? 1 : -1;
      }
      cancelSnapAnimation();
      scheduleSnap();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", requestMobileChromeSync);
    window.addEventListener("resize", applyFooterBackgroundState);
    window.visualViewport?.addEventListener("resize", requestMobileChromeSync);
    window.visualViewport?.addEventListener("resize", applyFooterBackgroundState);
    window.visualViewport?.addEventListener("scroll", requestMobileChromeSync);
    window.visualViewport?.addEventListener("scroll", applyFooterBackgroundState);

    return () => {
      if (mobileChromeFrame) {
        window.cancelAnimationFrame(mobileChromeFrame);
      }
      cancelSnapAnimation();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", requestMobileChromeSync);
      window.removeEventListener("resize", applyFooterBackgroundState);
      window.visualViewport?.removeEventListener("resize", requestMobileChromeSync);
      window.visualViewport?.removeEventListener("resize", applyFooterBackgroundState);
      window.visualViewport?.removeEventListener("scroll", requestMobileChromeSync);
      window.visualViewport?.removeEventListener("scroll", applyFooterBackgroundState);
      window.__PORTFOLIO_SET_TIMELINE_BACKGROUND = previousTimelineBackgroundSetter;
      window.__PORTFOLIO_APPLY_MOBILE_CHROME_COLOR = previousMobileChromeSetter;
      window.__PORTFOLIO_SYNC_MOBILE_CHROME = previousMobileChromeSync;
      window.__portfolioTimelineSafeAreaBarsAllowed = previousSafeAreaBarsAllowed;
      document.documentElement.style.removeProperty("--app-top-chrome");
      document.documentElement.style.removeProperty("--portfolio-mobile-chrome");
      document.documentElement.style.removeProperty("--portfolio-mobile-chrome-top");
      document.documentElement.style.removeProperty("--portfolio-mobile-chrome-bottom");
      document.documentElement.style.removeProperty("--portfolio-overscroll-background");
      document.body.style.removeProperty("--app-top-chrome");
      document.body.style.removeProperty("--portfolio-mobile-chrome");
      document.body.style.removeProperty("--portfolio-mobile-chrome-top");
      document.body.style.removeProperty("--portfolio-mobile-chrome-bottom");
      document.body.style.removeProperty("--portfolio-overscroll-background");
      document.querySelectorAll(".portfolio-mobile-chrome-fill").forEach((element) => {
        element.remove();
      });
      const themeColorMeta = document.querySelector("meta[name='theme-color']");
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", previousThemeColorContent);
      }
      document.documentElement.classList.remove("home-scroll-snap");
      document.documentElement.classList.remove("portfolio-footer-background-active");
      document.body.classList.remove("home-scroll-snap");
      document.body.classList.remove("portfolio-footer-background-active");
    };
  }, []);

  return (
    <div
      className="home-scroll-shell"
      style={{
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Hero */}
      <div
        id="home"
        className="center-container home-snap-section"
        data-mobile-chrome-color="#ffffff"
        style={{ width: "100%" }}
      >
        <div className="content-container" data-snap-anchor="center">
          <ProfileHeader
            image={`${import.meta.env.DEV ? "/images" : "https://pub-6eb94f6bdfbf410fa3232ad37ef1deab.r2.dev"}/me/JannisGrimm.png`}
            title="Engineer. Innovator. Leader"
          />
        </div>
      </div>

      <div
        id="overview"
        className="home-snap-section"
        data-mobile-chrome-color="#ffffff"
        style={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background: "white",
        }}
      >
        <div data-snap-anchor="center">
          {/* Quote */}
          <div
            className="center-container overview-quote-block"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="content-container">
              <Quotes />
            </div>
          </div>

          {/* Stats + GitHub Contributions */}
          <div
            className="center-container overview-stats-block"
            style={{
              width: "100%",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="content-container">
              <div>
                <Achievements githubContributionTotal={githubContributionTotal} />
              </div>

              <div>
                <GitHubContributions
                  username="iamjannisgrimm"
                  onTotalContributionsChange={setGithubContributionTotal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="highlights"
        className="home-snap-section home-highlights-section"
        data-mobile-chrome-color="#d5c1c5"
        style={{ width: "100%" }}
      >
        <div data-snap-anchor="center">
          <FeaturedProjectsStory />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          position: "relative",
          zIndex: 3,
          backgroundColor: "#2f4257",
        }}
        data-mobile-chrome-color="#2f4257"
      >
        <EventPlannerStory />
      </div>

      <div
        id="assistants"
        className="home-snap-section"
        style={{
          width: "100%",
          position: "relative",
          zIndex: 1,
          backgroundColor: "transparent",
        }}
        data-mobile-chrome-color="#ffffff"
      >
        <div data-snap-anchor="center">
          <AssistantsShowcase />
        </div>
      </div>

      {/* Footer */}
      <div
        id="contact"
        className="center-container home-snap-section"
        data-mobile-chrome-color="#0d1117"
        style={{ width: "100%", backgroundColor: "#0d1117" }}
      >
        <div className="content-container">
          <ConnectSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
