import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FeaturedProjectsStory.css";

gsap.registerPlugin(ScrollTrigger);

function setThemeColor(color) {
  if (window.matchMedia?.("(max-width: 768px)").matches && window.__PORTFOLIO_SYNC_MOBILE_CHROME) {
    window.__PORTFOLIO_SYNC_MOBILE_CHROME();
    return;
  }

  const meta = document.querySelector("meta[name='theme-color']");
  if (meta) meta.setAttribute("content", color);
}

const TEAM_INFO_START = 1.18;
const TEAM_INFO_STEP = 0.72;
const TEAM_MEDIA_TEXT_GAP = 0.36;
const TEAM_INFO_EXIT_GAP = 0.64;

function makeTeamMediaSnapStops(infoCount, timelineDuration) {
  if (!timelineDuration) return [0, 1];

  const stops = [0, 1.02];
  Array.from({ length: infoCount }).forEach((_, index) => {
    const imageStart = TEAM_INFO_START + index * TEAM_INFO_STEP;
    const textStart = imageStart + TEAM_MEDIA_TEXT_GAP;
    const isLast = index === infoCount - 1;
    stops.push(imageStart + 0.18, isLast ? timelineDuration : textStart + 0.18);
  });

  return stops.map((stop) => Math.max(0, Math.min(1, stop / timelineDuration)));
}

function createOneStepScrollController(trigger, stops, options = {}) {
  if (!trigger || stops.length < 2) return () => {};

  const { previousTrigger = null, nextTrigger = null } = options;
  const orderedStops = [...new Set(stops)]
    .map((stop) => Math.max(0, Math.min(1, stop)))
    .sort((left, right) => left - right);
  let isAnimating = false;
  let isGestureLocked = false;
  let unlockTimer = null;
  let tween = null;
  let touchStartY = 0;
  let touchCommitted = false;
  let wheelDeltaTotal = 0;
  let wheelDirection = 0;
  let wheelResetTimer = null;
  const gestureQuietMs = 240;
  const wheelCommitThreshold = 28;
  const wheelResetMs = 120;
  const touchCommitThreshold = 24;

  const nearestIndex = () =>
    orderedStops.reduce(
      (nearest, stop, index) =>
        Math.abs(stop - trigger.progress) < Math.abs(orderedStops[nearest] - trigger.progress)
          ? index
          : nearest,
      0,
    );

  const getScrollY = () => window.scrollY || window.pageYOffset || 0;

  const isInsideTrigger = (buffer = 2) => {
    const scrollY = getScrollY();
    return scrollY >= trigger.start - buffer && scrollY <= trigger.end + buffer;
  };

  const willEnterTrigger = (direction, magnitude) => {
    if (!direction || !magnitude) return false;
    const scrollY = getScrollY();
    const projectedY = scrollY + direction * Math.max(Math.abs(magnitude), 140);

    if (direction > 0) {
      return scrollY < trigger.start && projectedY >= trigger.start;
    }

    return scrollY > trigger.end && projectedY <= trigger.end;
  };

  const isLeavingBoundary = (direction) => {
    if (!isInsideTrigger(8)) return false;

    const currentIndex = nearestIndex();
    const boundaryTolerance = 0.06;
    const isAtFirstStop =
      currentIndex === 0 && trigger.progress <= orderedStops[0] + boundaryTolerance;
    const isAtLastStop =
      currentIndex === orderedStops.length - 1 &&
      trigger.progress >= orderedStops[orderedStops.length - 1] - boundaryTolerance;

    return (direction < 0 && isAtFirstStop) || (direction > 0 && isAtLastStop);
  };

  const getLinkedBoundaryY = (direction) => {
    if (direction > 0 && nextTrigger) return nextTrigger.start;
    if (direction < 0 && previousTrigger) return previousTrigger.end;

    const snapTriggers = ScrollTrigger.getAll().filter((candidate) => {
      const id = candidate.vars?.id || "";
      return candidate !== trigger && /-(product|overlay)$/.test(id);
    });

    if (direction > 0) {
      const next = snapTriggers
        .filter((candidate) => candidate.start > trigger.end + 2)
        .sort((left, right) => left.start - right.start)[0];
      return next?.start ?? null;
    }

    const previous = snapTriggers
      .filter((candidate) => candidate.end < trigger.start - 2)
      .sort((left, right) => right.end - left.end)[0];
    return previous?.end ?? null;
  };

  const shouldHandleGesture = (direction, magnitude) => {
    if (isInsideTrigger()) {
      return !isLeavingBoundary(direction) || getLinkedBoundaryY(direction) !== null;
    }

    return willEnterTrigger(direction, magnitude);
  };

  const getTargetIndex = (direction) => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (direction > 0 && scrollY < trigger.start - 2) return 0;
    if (direction < 0 && scrollY > trigger.end + 2) return orderedStops.length - 1;

    const currentIndex = nearestIndex();
    return Math.max(0, Math.min(orderedStops.length - 1, currentIndex + direction));
  };

  const clearUnlock = () => {
    if (unlockTimer) window.clearTimeout(unlockTimer);
    unlockTimer = null;
  };

  const clearWheelIntent = () => {
    if (wheelResetTimer) window.clearTimeout(wheelResetTimer);
    wheelResetTimer = null;
    wheelDeltaTotal = 0;
    wheelDirection = 0;
  };

  const scheduleWheelIntentReset = () => {
    if (wheelResetTimer) window.clearTimeout(wheelResetTimer);
    wheelResetTimer = window.setTimeout(() => {
      clearWheelIntent();
    }, wheelResetMs);
  };

  const scheduleUnlock = () => {
    if (unlockTimer) return;
    unlockTimer = window.setTimeout(() => {
      if (!isAnimating) isGestureLocked = false;
      unlockTimer = null;
    }, gestureQuietMs);
  };

  const moveOneStep = (direction) => {
    const boundaryTargetY = isLeavingBoundary(direction) ? getLinkedBoundaryY(direction) : null;
    const targetIndex = getTargetIndex(direction);
    const currentIndex = nearestIndex();
    const isOutsideBefore = getScrollY() < trigger.start - 2;
    const isOutsideAfter = getScrollY() > trigger.end + 2;
    if (
      boundaryTargetY === null &&
      targetIndex === currentIndex &&
      !isOutsideBefore &&
      !isOutsideAfter
    ) {
      return false;
    }

    const startY = getScrollY();
    const targetY =
      boundaryTargetY ?? trigger.start + (trigger.end - trigger.start) * orderedStops[targetIndex];
    const state = { y: startY };

    tween?.kill();
    isAnimating = true;
    isGestureLocked = true;
    const isEnteringFromOutside = isOutsideBefore || isOutsideAfter || boundaryTargetY !== null;
    tween = gsap.to(state, {
      y: targetY,
      duration: isEnteringFromOutside ? 0.34 : 0.28,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        window.scrollTo(0, state.y);
      },
      onComplete: () => {
        isAnimating = false;
        scheduleUnlock();
      },
    });

    return true;
  };

  const blockGesture = () => {
    isGestureLocked = true;
    scheduleUnlock();
  };

  const stopGestureEvent = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation?.();
  };

  const onWheel = (event) => {
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    const direction = delta > 0 ? 1 : -1;
    if (!shouldHandleGesture(direction, delta)) return;

    if (Math.abs(delta) < 6) {
      stopGestureEvent(event);
      if (direction !== wheelDirection) {
        wheelDeltaTotal = 0;
        wheelDirection = direction;
      }
      wheelDeltaTotal += Math.abs(delta);
      scheduleWheelIntentReset();
      if (!isAnimating && !isGestureLocked && wheelDeltaTotal >= wheelCommitThreshold) {
        clearWheelIntent();
        if (moveOneStep(direction)) {
          blockGesture();
        } else if (isLeavingBoundary(direction)) {
          return;
        }
      }
      if (isGestureLocked) scheduleUnlock();
      return;
    }

    if (isAnimating || isGestureLocked) {
      stopGestureEvent(event);
      clearWheelIntent();
      blockGesture();
      return;
    }

    if (direction !== wheelDirection) {
      wheelDeltaTotal = 0;
      wheelDirection = direction;
    }
    wheelDeltaTotal += Math.abs(delta);
    scheduleWheelIntentReset();

    if (wheelDeltaTotal >= wheelCommitThreshold) {
      clearWheelIntent();
      if (moveOneStep(direction)) {
        stopGestureEvent(event);
        blockGesture();
      }
      return;
    }

    stopGestureEvent(event);
  };

  const onKeyDown = (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const forwardKeys = ["ArrowDown", "PageDown", " "];
    const backKeys = ["ArrowUp", "PageUp"];
    if (!forwardKeys.includes(event.key) && !backKeys.includes(event.key)) return;

    const direction = forwardKeys.includes(event.key) ? 1 : -1;
    if (!shouldHandleGesture(direction, window.innerHeight * 0.72)) return;

    if (isAnimating || isGestureLocked || moveOneStep(direction)) {
      stopGestureEvent(event);
      blockGesture();
    }
  };

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    touchStartY = event.touches[0].clientY;
    touchCommitted = false;
  };

  const onTouchMove = (event) => {
    if (event.touches.length !== 1) return;

    const nextY = event.touches[0].clientY;
    const delta = touchStartY - nextY;
    const direction = delta > 0 ? 1 : -1;
    if (!shouldHandleGesture(direction, Math.abs(delta))) return;

    if (isAnimating || isGestureLocked || touchCommitted) {
      stopGestureEvent(event);
      blockGesture();
      return;
    }

    if (Math.abs(delta) < touchCommitThreshold) {
      stopGestureEvent(event);
      return;
    }

    touchCommitted = true;
    if (moveOneStep(direction)) {
      stopGestureEvent(event);
      blockGesture();
    }
  };

  const onTouchEnd = () => {
    touchStartY = 0;
    touchCommitted = false;
    if (isGestureLocked) scheduleUnlock();
  };

  window.addEventListener("wheel", onWheel, { passive: false, capture: true });
  window.addEventListener("keydown", onKeyDown, { capture: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
  window.addEventListener("touchend", onTouchEnd, { capture: true });
  window.addEventListener("touchcancel", onTouchEnd, { capture: true });

  return () => {
    window.removeEventListener("wheel", onWheel, { capture: true });
    window.removeEventListener("keydown", onKeyDown, { capture: true });
    window.removeEventListener("touchstart", onTouchStart, { capture: true });
    window.removeEventListener("touchmove", onTouchMove, { capture: true });
    window.removeEventListener("touchend", onTouchEnd, { capture: true });
    window.removeEventListener("touchcancel", onTouchEnd, { capture: true });
    clearUnlock();
    clearWheelIntent();
    tween?.kill();
  };
}

function buildPanelTimeline({
  header,
  image,
  companion,
  badge,
  url,
  infos,
  inlineTitles = [],
  teamIntro = null,
  isDesktop,
  travel,
  extraY = 0,
}) {
  const headerH = header ? header.offsetHeight + 16 : 0;
  const hasCompanion = !!companion;
  const introHold = hasCompanion ? 0.18 : 0.2;
  const hasInlineTitles = inlineTitles.length > 0;
  const verticalTravel = isDesktop
    ? Math.max(180, Math.round(window.innerHeight * 0.28))
    : 56;

  if (hasInlineTitles) {
    if (teamIntro?.introDescription) {
      gsap.set(teamIntro.introDescription, { opacity: 1, y: 0 });
    }
    if (teamIntro?.cardsDescription) {
      gsap.set(teamIntro.cardsDescription, { opacity: 0, y: 18 });
    }
    const teamInfoItems = infos.map((info) => ({
      root: info,
      media: info?.querySelector(".highlights-stack__infoMedia") || null,
      content: info?.querySelector(".highlights-stack__infoContent") || null,
    }));

    if (infos[0]) gsap.set(infos[0], { opacity: 0, y: 28 });
    if (infos[1]) gsap.set(infos[1], { opacity: 0, y: 36 });
    if (infos[2]) gsap.set(infos[2], { opacity: 0, y: 44 });

    inlineTitles.forEach((title, index) => {
      gsap.set(title, {
        opacity: index === 0 ? 1 : 0,
        y: index === 0 ? 0 : 18,
      });
    });

    const tl = gsap.timeline({ paused: true });
    const isTeamInlineSequence =
      !!teamIntro?.introVisual && !!teamIntro?.cards && !!teamIntro?.targetCircle;
    const introStops = isTeamInlineSequence ? [0.18, 0.58] : [0.18, 0.5, 0.82];
    const outroStops = isTeamInlineSequence ? [0.5] : [0.38, 0.7];
    const teamCardsExitStart = 1.16;
    const teamSoloStart = 1.18;

    if (teamIntro?.introVisual && teamIntro?.cards && teamIntro?.targetCircle) {
      const isMobileTeamScene =
        !isDesktop &&
        teamIntro.leftCard &&
        teamIntro.leftSlot &&
        teamIntro.bridge &&
        teamIntro.rightCard &&
        teamIntro.connector;
      const introRect = teamIntro.introVisual.getBoundingClientRect();
      const targetRect = teamIntro.targetCircle.getBoundingClientRect();
      const deltaX =
        targetRect.left + targetRect.width / 2 - (introRect.left + introRect.width / 2);
      const deltaY =
        targetRect.top + targetRect.height / 2 - (introRect.top + introRect.height / 2);
      const scale = targetRect.width / Math.max(introRect.width, 1);
      const desktopCardShiftX =
        !isMobileTeamScene && teamIntro.leftCard && teamIntro.rightCard
          ? teamIntro.leftCard.getBoundingClientRect().left - teamIntro.rightCard.getBoundingClientRect().left
          : 0;
      const desktopCardCenterX =
        !isMobileTeamScene && teamIntro.rightCard
          ? (() => {
              const rightRect = teamIntro.rightCard.getBoundingClientRect();
              return window.innerWidth / 2 - (rightRect.left + rightRect.width / 2);
            })()
          : 0;
      const hasTeamMediaSequence =
        teamInfoItems.some((item) => item.media);

      if (isMobileTeamScene) {
        gsap.set(teamIntro.leftSlot, {
          height: 0,
          opacity: 0,
          marginTop: 0,
          overflow: "hidden",
        });
        gsap.set(teamIntro.leftCard, { opacity: 1, y: 0 });
        gsap.set(teamIntro.bridge, { opacity: 0, y: 10 });
        gsap.set(teamIntro.connector, { opacity: 1 });
        gsap.set(teamIntro.rightCard, { opacity: 0, y: 18 });
        gsap.set(teamIntro.targetCircle, { opacity: 0 });
        if (teamIntro.infoWindow) gsap.set(teamIntro.infoWindow, { opacity: 0, y: 24 });
      } else {
        if (teamIntro.leftCard) gsap.set(teamIntro.leftCard, { opacity: 0, y: 18 });
        if (teamIntro.bridge) gsap.set(teamIntro.bridge, { opacity: 0, y: 10 });
        if (teamIntro.rightCard) gsap.set(teamIntro.rightCard, { opacity: 0, y: 18 });
        if (teamIntro.infoWindow) gsap.set(teamIntro.infoWindow, { opacity: 0, y: 24 });
        if (hasTeamMediaSequence) {
          teamInfoItems.forEach(({ root, media, content }) => {
            if (root) gsap.set(root, { opacity: 0, y: 0 });
            if (media) gsap.set(media, { opacity: 0, y: 58, scale: 0.98 });
            if (content) gsap.set(content, { opacity: 0, y: 22 });
          });
        }
      }
      if (header) {
        gsap.set(header, { overflow: "hidden", height: header.offsetHeight });
      }
      gsap.set(teamIntro.introVisual, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        borderRadius: "28px",
        transformOrigin: "center center",
      });

      tl.to(teamIntro.introVisual, {
        borderRadius: "999px",
        duration: 0.26,
        ease: "power1.inOut",
      }, 0.56);
      if (teamIntro.introDescription) {
        tl.to(teamIntro.introDescription, {
          opacity: 0,
          y: -10,
          duration: 0.14,
          ease: "power1.inOut",
        }, 0.56);
      }

      if (isMobileTeamScene) {
        tl.to(teamIntro.leftSlot, {
          height: "auto",
          opacity: 1,
          marginTop: 30,
          duration: 0.22,
          ease: "power2.out",
        }, 0.54);
        tl.to(teamIntro.bridge, {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: "power2.out",
        }, 0.74);
        tl.to(teamIntro.rightCard, {
          opacity: 1,
          y: -8,
          duration: 0.14,
          ease: "power1.out",
        }, 0.76);
        tl.to(teamIntro.targetCircle, {
          opacity: 1,
          duration: 0.08,
          ease: "power1.out",
        }, 0.84);
      } else {
        tl.to([teamIntro.leftCard, teamIntro.bridge, teamIntro.rightCard], {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
          stagger: 0.04,
        }, 0.74);
      }

      if (header) {
        tl.to(header, {
          height: 0,
          paddingBottom: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
        }, 0.56);
      }

      tl.to(teamIntro.introVisual, {
        x: deltaX,
        y: deltaY - 46,
        scale,
        duration: 0.34,
        ease: "power1.inOut",
      }, 0.58);

      tl.to(teamIntro.introVisual, {
        opacity: 0,
        duration: 0.08,
        ease: "power1.out",
      }, 0.84);

      if (teamIntro.cardsDescription) {
        tl.to(teamIntro.cardsDescription, {
          opacity: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
        }, 0.86);
      }

      if (isMobileTeamScene) {
        tl.to([teamIntro.leftSlot, teamIntro.bridge], {
          opacity: 0,
          y: -18,
          duration: 0.16,
          ease: "power1.inOut",
        }, teamCardsExitStart);
        if (teamIntro.cardsDescription) {
          tl.to(teamIntro.cardsDescription, {
            opacity: 0,
            y: -12,
            duration: 0.14,
            ease: "power1.inOut",
          }, teamCardsExitStart);
        }
        tl.to(teamIntro.rightCard, {
          y: -320,
          duration: 0.32,
          ease: "power2.inOut",
        }, teamSoloStart);
      } else {
        tl.to([teamIntro.leftCard, teamIntro.bridge], {
          opacity: 0,
          x: -220,
          duration: 0.22,
          ease: "power1.inOut",
        }, teamCardsExitStart);
        if (teamIntro.cardsDescription) {
          tl.to(teamIntro.cardsDescription, {
            opacity: 0,
            y: -12,
            duration: 0.14,
            ease: "power1.inOut",
          }, teamCardsExitStart);
        }
        tl.to(teamIntro.rightCard, {
          x: hasTeamMediaSequence ? desktopCardCenterX : desktopCardShiftX - 140,
          y: 0,
          duration: 0.32,
          ease: "power2.inOut",
        }, teamSoloStart);
      }

      if (teamIntro.infoWindow) {
        tl.to(teamIntro.infoWindow, {
          opacity: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
        }, TEAM_INFO_START);
      }

      if (hasTeamMediaSequence) {
        teamInfoItems.forEach(({ root, media, content }, index) => {
          const imageStart = TEAM_INFO_START + index * TEAM_INFO_STEP;
          const textStart = imageStart + TEAM_MEDIA_TEXT_GAP;
          const exitStart = imageStart + TEAM_INFO_EXIT_GAP;

          if (root) {
            tl.to(root, {
              opacity: 1,
              y: 0,
              duration: 0.12,
              ease: "power2.out",
            }, imageStart);
          }
          if (media) {
            tl.to(media, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.2,
              ease: "power3.out",
            }, imageStart);
            tl.to(media, {
              opacity: 0,
              y: -22,
              scale: 0.98,
              duration: 0.14,
              ease: "power1.inOut",
            }, textStart);
          }
          if (content) {
            tl.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.18,
              ease: "power2.out",
            }, textStart + 0.03);
            if (index < teamInfoItems.length - 1) {
              tl.to(content, {
                opacity: 0,
                y: -20,
                duration: 0.14,
                ease: "power1.inOut",
              }, exitStart);
            }
          }
          if (root && index < teamInfoItems.length - 1) {
            tl.to(root, {
              opacity: 0,
              duration: 0.1,
              ease: "power1.inOut",
            }, exitStart + 0.04);
          }
        });
        tl.to(teamIntro.infoWindow, {
          opacity: 1,
          duration: 0.36,
          ease: "none",
        }, TEAM_INFO_START + teamInfoItems.length * TEAM_INFO_STEP + 0.18);
      } else {
        if (infos[0]) {
          tl.to(infos[0], {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: "power2.out",
          }, TEAM_INFO_START + 0.04);
          if (infos[1] || infos[2]) {
            tl.to(infos[0], {
              opacity: 0,
              y: -20,
              duration: 0.14,
              ease: "power1.inOut",
            }, TEAM_INFO_START + 0.26);
          }
        }

        if (infos[1]) {
          tl.to(infos[1], {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: "power2.out",
          }, TEAM_INFO_START + 0.32);
          if (infos[2]) {
            tl.to(infos[1], {
              opacity: 0,
              y: -20,
              duration: 0.14,
              ease: "power1.inOut",
            }, TEAM_INFO_START + 0.54);
          }
        }

        if (infos[2]) {
          tl.to(infos[2], {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: "power2.out",
          }, TEAM_INFO_START + 0.6);
        }
      }
    }

    inlineTitles.forEach((title, index) => {
      if (index > 0) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
        }, introStops[Math.min(index, introStops.length - 1)]);
      }

      if (index < inlineTitles.length - 1) {
        tl.to(title, {
          opacity: 0,
          y: -18,
          duration: 0.12,
          ease: "power1.inOut",
        }, outroStops[Math.min(index, outroStops.length - 1)]);
      }
    });

    return tl;
  }

  if (infos[0]) gsap.set(infos[0], { opacity: 0, x: -travel, y: isDesktop ? 0 : 12 });
  if (infos[1]) {
    gsap.set(infos[1], { opacity: 0, x: 0, y: verticalTravel });
  }
  if (infos[2]) gsap.set(infos[2], { opacity: 0, x: travel, y: isDesktop ? 0 : 12 });
  if (companion) gsap.set(companion, { opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  // Phase 1: title out + image up
  if (header) tl.to(header, { y: -22, opacity: 0, duration: 0.14, ease: "power1.in" }, introHold);
  if (image && headerH > 0) tl.to(image, { y: -(headerH + extraY), duration: 0.18, ease: "power2.inOut" }, introHold);
  const extras = [badge, url].filter(Boolean);
  if (extras.length) tl.to(extras, { opacity: 0, duration: 0.12, ease: "power1.in" }, introHold);

  if (hasCompanion) {
    // Phase 2: companion fades in, both images pan left together
    const slideX = image && image.offsetWidth
      ? -Math.round(image.offsetWidth * 0.50)
      : -Math.round(window.innerWidth * 0.22);
    tl.to(companion, { opacity: 1, duration: 0.22, ease: "power2.out" }, 0.36);
    tl.to(image, { x: slideX, duration: 0.26, ease: "power2.inOut" }, 0.36);

    // Phase 3–5: info blocks (shifted to make room for companion phase)
    if (infos[0]) {
      tl.to(infos[0], { x: 0, y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.58);
      tl.to(infos[0], { x: -travel, y: 0, opacity: 0, duration: 0.12, ease: "power1.in" }, 0.76);
    }
    if (infos[1]) {
      tl.to(infos[1], { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.82);
      tl.to(infos[1], { y: verticalTravel, opacity: 0, duration: 0.12, ease: "power1.in" }, 1);
    }
    if (infos[2]) {
      tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 1.06);
    }
  } else {
    if (infos[0]) {
      tl.to(infos[0], { x: 0, y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }, 0.36);
      tl.to(infos[0], { x: -travel, y: 0, opacity: 0, duration: 0.14, ease: "power1.in" }, 0.64);
    }
    if (infos[1]) {
      tl.to(infos[1], { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }, 0.68);
      tl.to(infos[1], { y: verticalTravel, opacity: 0, duration: 0.14, ease: "power1.in" }, 0.96);
    }
    if (infos[2]) {
      tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }, 1);
    }
  }

  return tl;
}

function getPanelSnapStops(hasCompanion = false) {
  return hasCompanion
    ? [0, 0.62, 0.82, 1.0]
    : [0, 0.47, 0.74, 1.0];
}

function makeSnapConfig(hasCompanion = false) {
  const stops = getPanelSnapStops(hasCompanion);
  return {
    snapTo: (value) => stops.reduce((a, b) =>
      Math.abs(b - value) < Math.abs(a - value) ? b : a
    ),
    duration: { min: 0.04, max: 0.08 },
    delay: 0,
    inertia: false,
    ease: "power3.out",
  };
}

function getInlineTitleSnapStops(count, isTeamInlineSequence = false, hasTeamMediaSequence = false) {
  const baseStops = isTeamInlineSequence
    ? hasTeamMediaSequence
      ? [0, 0.18, 0.43, 0.54, 0.62, 0.7, 0.78, 0.86, 0.94, 1]
      : [0, 0.18, 0.43, 0.66, 0.8, 0.92, 1]
    : [0, 0.18, 0.5, 0.82, 1];
  return isTeamInlineSequence
    ? baseStops
    : baseStops.slice(0, Math.max(3, count + 2));
}

function makeInlineTitleSnapConfig(count, isTeamInlineSequence = false, hasTeamMediaSequence = false) {
  const stops = getInlineTitleSnapStops(count, isTeamInlineSequence, hasTeamMediaSequence);
  return {
    snapTo: (value) => stops.reduce((a, b) =>
      Math.abs(b - value) < Math.abs(a - value) ? b : a
    ),
    duration: { min: 0.04, max: 0.08 },
    delay: 0,
    inertia: false,
    ease: "power3.out",
  };
}

function makeOneStepSnapConfig(stops) {
  let activeIndex = 0;
  const nearestIndex = (value) =>
    stops.reduce(
      (nearest, stop, index) =>
        Math.abs(stop - value) < Math.abs(stops[nearest] - value) ? index : nearest,
      0,
    );

  return {
    snapTo: (value, trigger) => {
      const currentStop = stops[activeIndex] ?? 0;
      if (Math.abs(value - currentStop) < 0.015) {
        activeIndex = nearestIndex(value);
        return stops[activeIndex];
      }

      const direction = trigger?.direction || (value > currentStop ? 1 : -1);
      activeIndex = Math.max(
        0,
        Math.min(stops.length - 1, activeIndex + (direction > 0 ? 1 : -1)),
      );
      return stops[activeIndex];
    },
    duration: { min: 0.04, max: 0.08 },
    delay: 0,
    inertia: false,
    ease: "power3.out",
  };
}

function MobileCarousel({ images, title, carouselRef, startIndex = 0 }) {
  const imgRefs = useRef([]);
  const normalizedStartIndex =
    images.length > 0 ? ((startIndex % images.length) + images.length) % images.length : 0;
  const curIdx = useRef(normalizedStartIndex);

  useEffect(() => {
    imgRefs.current[normalizedStartIndex]?.classList.add("highlights-stack__carouselImg--active");

    if (!carouselRef) return;
    carouselRef.current = (progress) => {
      const total = images.length;
      const rawIdx = Math.min(Math.floor(progress * total), total - 1);
      const idx = total > 0 ? (rawIdx + normalizedStartIndex) % total : 0;
      if (idx === curIdx.current) return;
      imgRefs.current[curIdx.current]?.classList.remove("highlights-stack__carouselImg--active");
      imgRefs.current[idx]?.classList.add("highlights-stack__carouselImg--active");
      curIdx.current = idx;
    };
    return () => { if (carouselRef) carouselRef.current = null; };
  }, [carouselRef, images.length, normalizedStartIndex]);

  return (
    <div className="highlights-stack__carouselTrack">
      {images.map((src, i) => (
        <img
          key={i}
          ref={(el) => { imgRefs.current[i] = el; }}
          className="highlights-stack__carouselImg"
          src={src}
          alt={`${title} ${i + 1}`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
    </div>
  );
}

function PanelShell({
  panelContent,
  panelInfoBlocks,
  headerRef,
  imageRef,
  companionImageRef,
  badgeRef,
  urlRef,
  infoRefsObj,
  inlineTitleRefsObj,
  teamIntroRef,
  teamCardsRef,
  teamLeftSlotRef,
  teamLeftCardRef,
  teamBridgeRef,
  teamConnectorRef,
  teamRightCardRef,
  teamRightCircleRef,
  teamIntroDescriptionRef,
  teamCardsDescriptionRef,
  teamInfoWindowRef,
  carouselRef,
  prioritizeMedia = false,
}) {
  const { hero } = panelContent;
  const hasCompanion = !!hero.companionImage;
  const inlineTitles = Array.isArray(hero.inlineTitles) ? hero.inlineTitles : [];
  const teamCards = hero.teamCards || null;
  const teamBridgeIcons = hero.teamBridgeIcons || null;
  const teamBridgeLabel = hero.teamBridgeLabel || "";
  const teamIntroDescription = hero.teamIntroDescription || "";
  const teamCardsDescription = hero.teamCardsDescription || "";
  const hasStandaloneRotator = !hero.title && inlineTitles.length > 0;
  const hasMultilineInlineTitle = inlineTitles.some((title) => title.includes("\n"));
  const longestInlineTitle = inlineTitles.reduce(
    (longest, title) => (title.length > longest.length ? title : longest),
    inlineTitles[0] || "",
  );
  const ctaHref = hero.link || hero.ctaHref || hero.productUrl || undefined;
  const ctaAriaLabel =
    hero.ctaAriaLabel ||
    (hero.ctaLabel ? `${hero.ctaLabel} for ${hero.title}` : "Open project link");

  return (
    <div className="highlights-stack__productShell">
      <div
        className={`highlights-stack__productHeader ${
          inlineTitles.length ? "highlights-stack__productHeader--inlineRotator" : ""
        }`}
        ref={headerRef}
      >
        <h2 className="highlights-stack__productTitle">
          {hero.title ? <span>{hero.title}</span> : null}
          {inlineTitles.length ? (
            <span
              className={`highlights-stack__titleRotator ${
                hasStandaloneRotator ? "highlights-stack__titleRotator--standalone" : ""
              }`}
              aria-label={`${hero.title || "Team"} roles`}
            >
              <span
                className={`highlights-stack__titleSizer ${
                  hasMultilineInlineTitle ? "highlights-stack__titleSizer--multiline" : ""
                }`}
                aria-hidden="true"
              >
                {longestInlineTitle}
              </span>
              {inlineTitles.map((title, i) => (
                <span
                  key={title}
                  ref={(node) => {
                    inlineTitleRefsObj.current[i] = node;
                  }}
                  className={`highlights-stack__titleWord ${
                    title.includes("\n") ? "highlights-stack__titleWord--multiline" : ""
                  }`}
                >
                  {title.includes("\n")
                    ? title.split("\n").map((line, lineIndex, lines) => (
                        <span
                          key={`${title}-${lineIndex}`}
                          className={`highlights-stack__titleLine ${
                            i === 0 && lineIndex === lines.length - 1
                              ? "highlights-stack__titleLine--heavy"
                              : ""
                          }`}
                        >
                          {line}
                        </span>
                      ))
                    : title}
                </span>
              ))}
            </span>
          ) : null}
        </h2>
        {hero.headline ? (
          <p className="highlights-stack__productSubtitle">{hero.headline}</p>
        ) : null}
      </div>

      <div className="highlights-stack__productImageGroup">
        {Array.isArray(hero.productImages) && hero.productImages.length ? (
          <div ref={imageRef} className="highlights-stack__productImagesOuter">
            <div className="highlights-stack__productImages highlights-stack__productImages--desktop">
              {hero.productImages.map((src, i) => (
                <img
                  key={i}
                  className="highlights-stack__productImageItem"
                  src={src}
                  alt={`${hero.title} ${i + 1}`}
                  loading={prioritizeMedia ? "eager" : "lazy"}
                  fetchPriority={prioritizeMedia && i === 0 ? "high" : undefined}
                  decoding="async"
                />
              ))}
              {hasCompanion ? (
                <img
                  ref={companionImageRef}
                  className="highlights-stack__productImageItem highlights-stack__productImageItem--companion"
                  src={hero.companionImage}
                  alt={`${hero.title} companion`}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
            </div>
            <MobileCarousel
              images={hero.productImages}
              title={hero.title}
              carouselRef={carouselRef}
              startIndex={hero.mobileCarouselStartIndex || 0}
            />
          </div>
        ) : hero.productImage && hasCompanion ? (
          <div ref={imageRef} className="highlights-stack__productImages highlights-stack__productImages--pair">
            <img
              className="highlights-stack__productImageItem"
              src={hero.productImage}
              alt={hero.title}
              loading={prioritizeMedia ? "eager" : "lazy"}
              fetchPriority={prioritizeMedia ? "high" : undefined}
              decoding="async"
            />
            <img
              ref={companionImageRef}
              className="highlights-stack__productImageItem highlights-stack__productImageItem--companion"
              src={hero.companionImage}
              alt={`${hero.title} companion`}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : teamCards ? (
          <div
            ref={(node) => {
              if (imageRef) {
                imageRef.current = node;
              }
              if (teamCardsRef) {
                teamCardsRef.current = node;
              }
            }}
            className="highlights-stack__teamCards"
            aria-label={`${hero.title} team cards`}
          >
            <article
              ref={teamLeftSlotRef}
              className="highlights-stack__teamLeadSlot"
            >
              <article
                ref={teamLeftCardRef}
                className="highlights-stack__teamCard highlights-stack__teamCard--lead"
              >
                <div className="highlights-stack__teamCircle">
                  <img
                    className="highlights-stack__teamPortrait"
                    src={teamCards.left.image}
                    alt={teamCards.left.name}
                    loading={prioritizeMedia ? "eager" : "lazy"}
                    fetchPriority={prioritizeMedia ? "high" : undefined}
                    decoding="async"
                  />
                </div>
                <p className="highlights-stack__teamName">{teamCards.left.name}</p>
              </article>
            </article>
            <div ref={teamIntroRef} className="highlights-stack__teamIntro" aria-hidden="true">
              <div className="highlights-stack__teamIntroVisualWrap">
                <div className="highlights-stack__teamIntroVisual">
                  <img
                    className="highlights-stack__teamIntroImage"
                    src={teamCards.right.image}
                    alt=""
                    loading={prioritizeMedia ? "eager" : "lazy"}
                    fetchPriority={prioritizeMedia ? "high" : undefined}
                    decoding="async"
                  />
                </div>
                {teamIntroDescription ? (
                  <p
                    ref={teamIntroDescriptionRef}
                    className="highlights-stack__teamIntroDescription"
                  >
                    {teamIntroDescription}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="highlights-stack__teamSupport">
              <div
                ref={teamBridgeRef}
                className="highlights-stack__teamBridge"
                aria-hidden="true"
              >
                {teamBridgeLabel ? (
                  <div className="highlights-stack__teamBridgeLabel">
                    {teamBridgeLabel}
                  </div>
                ) : null}
                <div className="highlights-stack__teamBridgeIcons">
                  <div className="highlights-stack__teamBridgeIcon">
                    {teamBridgeIcons?.left?.image ? (
                      <img
                        className="highlights-stack__teamBridgeIconImage"
                        src={teamBridgeIcons.left.image}
                        alt={teamBridgeIcons.left.alt || ""}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-5 4v-3.5A2.5 2.5 0 0 1 4 14V6.5Z" />
                      </svg>
                    )}
                  </div>
                  <div className="highlights-stack__teamBridgeIcon">
                    {teamBridgeIcons?.right?.image ? (
                      <img
                        className="highlights-stack__teamBridgeIconImage"
                        src={teamBridgeIcons.right.image}
                        alt={teamBridgeIcons.right.alt || ""}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6.6 4.8c.4-.4 1-.5 1.5-.3l2.2 1c.7.3 1 .9.9 1.6l-.3 2c0 .5.1 1 .5 1.4l2.6 2.6c.4.4.9.6 1.4.5l2-.3c.7-.1 1.3.2 1.6.9l1 2.2c.2.5.1 1.1-.3 1.5l-1 1c-.8.8-2 1.1-3.1.8-2.3-.6-4.8-2.2-7-4.4-2.2-2.2-3.8-4.7-4.4-7-.3-1.1 0-2.3.8-3.1l1-1Z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  ref={teamConnectorRef}
                  className="highlights-stack__teamConnector"
                />
              </div>
              <article
                ref={teamRightCardRef}
                className="highlights-stack__teamCard highlights-stack__teamCard--support"
              >
                <div
                  ref={teamRightCircleRef}
                  className="highlights-stack__teamCircle highlights-stack__teamCircle--outlined"
                >
                  <img
                    className="highlights-stack__teamPortrait highlights-stack__teamPortrait--tars"
                    src={teamCards.right.image}
                    alt={teamCards.right.name}
                    loading={prioritizeMedia ? "eager" : "lazy"}
                    fetchPriority={prioritizeMedia ? "high" : undefined}
                    decoding="async"
                  />
                </div>
                <p className="highlights-stack__teamName">{teamCards.right.name}</p>
                {teamCards.right.description ? (
                  <p className="highlights-stack__teamDescription">{teamCards.right.description}</p>
                ) : null}
              </article>
            </div>
            {teamCardsDescription ? (
              <p
                ref={teamCardsDescriptionRef}
                className="highlights-stack__teamCardsDescription"
              >
                {teamCardsDescription}
              </p>
            ) : null}
          </div>
        ) : hero.productImage ? (
          <img
            ref={imageRef}
            className="highlights-stack__productImage"
            src={hero.productImage}
            alt={hero.title}
            loading={prioritizeMedia ? "eager" : "lazy"}
            fetchPriority={prioritizeMedia ? "high" : undefined}
            decoding="async"
          />
        ) : null}

        {hero.badge ? (
          <a
            ref={badgeRef}
            className="highlights-stack__badgeWrap"
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
          >
            <img
              className="highlights-stack__badge"
              src={hero.badge}
              alt="Download on the App Store"
              loading={prioritizeMedia ? "eager" : "lazy"}
              fetchPriority={prioritizeMedia ? "high" : undefined}
              decoding="async"
            />
          </a>
        ) : hero.ctaLabel ? (
          <a
            ref={badgeRef}
            className="highlights-stack__badgeWrap highlights-stack__badgeWrap--text"
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ctaAriaLabel}
          >
            <span className="highlights-stack__badgeText">{hero.ctaLabel}</span>
          </a>
        ) : null}

        {hero.productUrl ? (
          <a
            ref={urlRef}
            className="highlights-stack__productUrl"
            href={hero.productUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hero.productUrlLabel ||
              hero.productUrl
                .replace(/^https?:\/\/(www\.)?/, "")
                .replace(/\/$/, "")}
          </a>
        ) : null}
      </div>

      {panelInfoBlocks.length > 0 && (inlineTitles.length === 0 || teamCards) ? (
        <div
          className={`highlights-stack__infoWindow ${
            teamCards ? "highlights-stack__infoWindow--team" : ""
          }`}
          ref={teamCards ? teamInfoWindowRef : undefined}
        >
          {panelInfoBlocks.map((block, i) => (
            <div
              key={i}
              className="highlights-stack__infoBlock"
              data-block-index={i}
              ref={(node) => {
                infoRefsObj.current[i] = node;
              }}
            >
              {Array.isArray(block.mediaImages) && block.mediaImages.length ? (
                <div className="highlights-stack__infoMedia highlights-stack__infoMedia--agents" aria-hidden="true">
                  {block.mediaImages.map((media, mediaIndex) => (
                    <div
                      className="highlights-stack__infoMediaCell"
                      key={`${media.alt || "agent"}-${mediaIndex}`}
                    >
                      <img
                        className="highlights-stack__infoMediaImage"
                        src={media.image}
                        alt={media.alt || ""}
                        loading={prioritizeMedia ? "eager" : "lazy"}
                        decoding="async"
                      />
                      {media.title ? (
                        <span className="highlights-stack__infoMediaTitle">
                          {media.title}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : block.mediaImage ? (
                <div className="highlights-stack__infoMedia" aria-hidden="true">
                  <div className="highlights-stack__infoMediaCell">
                    <img
                      className="highlights-stack__infoMediaImage"
                      src={block.mediaImage}
                      alt={block.mediaAlt || ""}
                      loading={prioritizeMedia ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                </div>
              ) : null}
              <div className="highlights-stack__infoContent">
                {block.title ? (
                  <div className="highlights-stack__infoTitleSide">
                    {block.eyebrow ? (
                      <p className="highlights-stack__infoEyebrow">{block.eyebrow}</p>
                    ) : null}
                    <p className="highlights-stack__infoTitle">{block.title}</p>
                  </div>
                ) : null}
                <div className="highlights-stack__infoBodySide">
                  <p className="highlights-stack__infoBody">{block.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductStoryStack({
  content,
  stackId,
  className = "",
  backgroundStyle,
}) {
  const isPrimaryStack = stackId === "highlights-stack";
  const sectionRef = useRef(null);
  const heroCardRef = useRef(null);
  const productCardRef = useRef(null);
  const productHeaderRef = useRef(null);
  const productImageRef = useRef(null);
  const productCompanionImageRef = useRef(null);
  const productBadgeRef = useRef(null);
  const productUrlRef = useRef(null);
  const infoRefs = useRef([]);
  const productInlineTitleRefs = useRef([]);
  const productTeamIntroRef = useRef(null);
  const productTeamCardsRef = useRef(null);
  const productTeamLeftSlotRef = useRef(null);
  const productTeamLeftCardRef = useRef(null);
  const productTeamBridgeRef = useRef(null);
  const productTeamConnectorRef = useRef(null);
  const productTeamRightCardRef = useRef(null);
  const productTeamRightCircleRef = useRef(null);
  const productTeamIntroDescriptionRef = useRef(null);
  const productTeamCardsDescriptionRef = useRef(null);
  const productTeamInfoWindowRef = useRef(null);

  const productCarouselRef = useRef(null);

  const overlayCardRef = useRef(null);
  const overlayHeaderRef = useRef(null);
  const overlayImageRef = useRef(null);
  const overlayCompanionImageRef = useRef(null);
  const overlayBadgeRef = useRef(null);
  const overlayUrlRef = useRef(null);
  const overlayInfoRefs = useRef([]);
  const overlayInlineTitleRefs = useRef([]);

  const rootClassName = useMemo(
    () =>
      ["highlights-stack", className, content.overlay ? "highlights-stack--has-overlay" : ""]
        .filter(Boolean)
        .join(" "),
    [className, content.overlay],
  );

  const infoBlocks = useMemo(() => {
    if (Array.isArray(content.infoBlocks) && content.infoBlocks.length) {
      return content.infoBlocks;
    }
    return [
      { title: "", body: content.hero.headline || "" },
      { title: "", body: content.hero.detail || "" },
      { title: "", body: content.followUp?.headline || "" },
    ].filter((block) => block.body);
  }, [content]);

  const overlayInfoBlocks = useMemo(() => {
    if (!content.overlay) return [];
    if (Array.isArray(content.overlay.infoBlocks) && content.overlay.infoBlocks.length) {
      return content.overlay.infoBlocks;
    }
    return [];
  }, [content]);

  const mobileHeroChromeColor =
    content.hero.themeColor || content.hero.backgroundColor || "#ffffff";
  const mobileHeroChromeTopColor =
    content.hero.mobileChromeTopColor || content.hero.mobileChrome?.top || mobileHeroChromeColor;
  const mobileHeroChromeBottomColor =
    content.hero.mobileChromeBottomColor || content.hero.mobileChrome?.bottom || mobileHeroChromeColor;
  const mobileOverlayChromeColor =
    content.overlay?.hero?.themeColor ||
    content.overlay?.hero?.backgroundColor ||
    mobileHeroChromeColor;
  const mobileOverlayChromeTopColor =
    content.overlay?.hero?.mobileChromeTopColor ||
    content.overlay?.hero?.mobileChrome?.top ||
    mobileOverlayChromeColor;
  const mobileOverlayChromeBottomColor =
    content.overlay?.hero?.mobileChromeBottomColor ||
    content.overlay?.hero?.mobileChrome?.bottom ||
    mobileOverlayChromeColor;

  useLayoutEffect(() => {
    const heroCard = heroCardRef.current;
    const productCard = productCardRef.current;
    const section = sectionRef.current;
    if (!heroCard || !productCard || !section) return;
    const vvh = window.visualViewport?.height ?? window.innerHeight;
    const panelShells = Array.from(
      section.querySelectorAll(".highlights-stack__productShell"),
    );
    const tallestShell = panelShells.reduce(
      (maxHeight, shell) => Math.max(maxHeight, shell.scrollHeight),
      0,
    );
    // On mobile, size the pinned backdrop to the taller story shell so
    // the background image reaches the bottom of the section again.
    const heroH =
      window.innerWidth <= 768
        ? Math.max(window.innerHeight + 60, tallestShell + 40)
        : vvh;
    heroCard.style.height = `${heroH}px`;
    const shell = productCard.querySelector(".highlights-stack__productShell");
    if (shell) shell.style.minHeight = `${vvh}px`;
  }, []);

  useLayoutEffect(() => {
    const sources = [
      content.hero.backgroundImage,
      ...(Array.isArray(content.hero.productImages) ? content.hero.productImages : []),
      content.hero.productImage,
      content.hero.badge,
    ].filter(Boolean);

    const preloaded = sources.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });

    return () => {
      preloaded.forEach((image) => {
        image.src = "";
      });
    };
  }, [
    content.hero.backgroundImage,
    content.hero.badge,
    content.hero.productImage,
    content.hero.productImages,
  ]);

  useEffect(() => {
    const section = sectionRef.current;
    const heroCard = heroCardRef.current;
    const productCard = productCardRef.current;
    const productHeader = productHeaderRef.current;
    const productImage = productImageRef.current;
    const productCompanion = productCompanionImageRef.current;
    const productBadge = productBadgeRef.current;
    const productUrl = productUrlRef.current;
    const infos = infoRefs.current.filter(Boolean);
    const productInlineTitles = productInlineTitleRefs.current.filter(Boolean);
    const productTeamIntro = productTeamIntroRef.current;
    const productTeamCards = productTeamCardsRef.current;
    const productTeamLeftSlot = productTeamLeftSlotRef.current;
    const productTeamLeftCard = productTeamLeftCardRef.current;
    const productTeamConnector = productTeamConnectorRef.current;
    const productTeamRightCard = productTeamRightCardRef.current;
    const productTeamRightCircle = productTeamRightCircleRef.current;
    const productTeamIntroDescription = productTeamIntroDescriptionRef.current;
    const productTeamCardsDescription = productTeamCardsDescriptionRef.current;

    const overlayCard = overlayCardRef.current;
    const overlayHeader = overlayHeaderRef.current;
    const overlayImage = overlayImageRef.current;
    const overlayCompanion = overlayCompanionImageRef.current;
    const overlayBadge = overlayBadgeRef.current;
    const overlayUrl = overlayUrlRef.current;
    const oInfos = overlayInfoRefs.current.filter(Boolean);
    const overlayInlineTitles = overlayInlineTitleRefs.current.filter(Boolean);

    if (!section || !heroCard || !productCard) return undefined;

    // Fix mobile Safari: 100vh ≠ window.innerHeight when URL bar is visible
    const applyVh = () => {
      const vvh = window.visualViewport?.height ?? window.innerHeight;
      const panelShells = Array.from(
        section.querySelectorAll(".highlights-stack__productShell"),
      );
      const tallestShell = panelShells.reduce(
        (maxHeight, shell) => Math.max(maxHeight, shell.scrollHeight),
        0,
      );
      const heroH =
        window.innerWidth <= 768
          ? Math.max(window.innerHeight + 60, tallestShell + 40)
          : vvh;
      heroCard.style.height = `${heroH}px`;
      const shell = productCard.querySelector(".highlights-stack__productShell");
      if (shell) shell.style.minHeight = `${vvh}px`;
    };
    applyVh();
    window.addEventListener("resize", applyVh, { passive: true });
    window.visualViewport?.addEventListener("resize", applyVh);
    ScrollTrigger.addEventListener("refresh", applyVh);

    const heroThemeColor = content.hero.themeColor || content.hero.backgroundColor || "#ffffff";
    const overlayThemeColor = content.overlay?.hero?.themeColor || content.overlay?.hero?.backgroundColor || "#ffffff";
    const destroyStepScrollControllers = [];

    const ctx = gsap.context(() => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.id?.startsWith(`${stackId}-`)) t.kill();
      });

      const isDesktop = window.innerWidth > 768;
      const travel = isDesktop ? Math.round(window.innerWidth * 0.55) : 120;
      const isTeamInlineSequence =
        productInlineTitles.length > 0 &&
        !!productTeamIntro &&
        !!productTeamCards &&
        !!productTeamRightCircle;
      const hasTeamInfoSequence = isTeamInlineSequence && infos.length > 0;
      const hasTeamMediaSequence =
        isTeamInlineSequence &&
        infos.some((info) => info.querySelector(".highlights-stack__infoMedia"));

      // ── Product panel ──────────────────────────────────────────────────────
      const isPlanner = className.includes("highlights-stack--planner");
      const tl = buildPanelTimeline({
        header: productHeader,
        image: productImage,
        companion: productCompanion,
        badge: productBadge,
        url: productUrl,
        infos,
        inlineTitles: productInlineTitles,
        teamIntro:
          productTeamIntro && productTeamCards && productTeamRightCircle
            ? {
                introVisual: productTeamIntro,
                cards: productTeamCards,
              leftSlot: productTeamLeftSlot,
              leftCard: productTeamLeftCard,
              bridge: productTeamBridgeRef.current,
              connector: productTeamConnector,
              rightCard: productTeamRightCard,
              targetCircle: productTeamRightCircle,
              introDescription: productTeamIntroDescription,
              cardsDescription: productTeamCardsDescription,
              infoWindow: productTeamInfoWindowRef.current,
              }
            : null,
        isDesktop,
        travel,
        extraY: isPlanner ? 20 : 0,
      });
      const teamMediaSnapStops = hasTeamMediaSequence
        ? makeTeamMediaSnapStops(infos.length, tl.totalDuration())
        : [];
      const productSnapStops = productInlineTitles.length
        ? hasTeamMediaSequence
          ? teamMediaSnapStops
          : getInlineTitleSnapStops(
              productInlineTitles.length,
              isTeamInlineSequence,
              hasTeamMediaSequence,
            )
        : getPanelSnapStops(!!productCompanion);

      const productTrigger = ScrollTrigger.create({
        id: `${stackId}-product`,
        trigger: productCard,
        start: "top top",
        end: isDesktop
          ? hasTeamMediaSequence ? "+=320%" : "+=180%"
          : hasTeamInfoSequence ? "+=240%" : isTeamInlineSequence ? "+=155%" : "+=220%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        fastScrollEnd: false,
        preventOverlaps: stackId,
        animation: tl,
        invalidateOnRefresh: true,
        snap: false,
        onUpdate: (self) => {
          if (productCarouselRef.current) {
            productCarouselRef.current(self.progress);
          }
        },
      });
      // ── Overlay panel ──────────────────────────────────────────────────────
      let overlayTrigger = null;
      let overlaySnapStops = [];

      if (overlayCard && oInfos.length) {
        const contentTl = buildPanelTimeline({
          header: overlayHeader,
          image: overlayImage,
          companion: overlayCompanion,
          badge: overlayBadge,
          url: overlayUrl,
          infos: oInfos,
          inlineTitles: overlayInlineTitles,
          isDesktop,
          travel,
          extraY: isPlanner ? 20 : 0,
        });
        overlaySnapStops = overlayInlineTitles.length
          ? getInlineTitleSnapStops(overlayInlineTitles.length)
          : getPanelSnapStops(!!overlayCompanion);
        overlayTrigger = ScrollTrigger.create({
          id: `${stackId}-overlay`,
          trigger: overlayCard,
          start: "top top",
          end: isDesktop ? "+=180%" : "+=220%",
          pin: true,
          pinSpacing: true,
          scrub: true,
          fastScrollEnd: false,
          preventOverlaps: stackId,
          animation: contentTl,
          invalidateOnRefresh: true,
          snap: false,
          onEnter: () => setThemeColor(overlayThemeColor),
          onEnterBack: () => setThemeColor(overlayThemeColor),
          onLeaveBack: () => setThemeColor(heroThemeColor),
          onLeave: () => setThemeColor("#ffffff"),
        });
      }

      if (productSnapStops.length > 1) {
        destroyStepScrollControllers.push(
          createOneStepScrollController(productTrigger, productSnapStops, {
            nextTrigger: overlayTrigger,
          }),
        );
      }

      if (overlayTrigger && overlaySnapStops.length > 1) {
        destroyStepScrollControllers.push(
          createOneStepScrollController(overlayTrigger, overlaySnapStops, {
            previousTrigger: productTrigger,
          }),
        );
      }

      // ── Hero backdrop pin — stays through both panels ───────────────────────
      ScrollTrigger.create({
        id: `${stackId}-hero`,
        trigger: heroCard,
        start: "top top",
        end: () => (overlayTrigger ? overlayTrigger.end : productTrigger.end),
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onEnter: () => {
          setThemeColor(heroThemeColor);
          heroCard.classList.add("is-pinned");
        },
        onLeaveBack: () => {
          setThemeColor("#ffffff");
          heroCard.classList.remove("is-pinned");
        },
        onLeave: () => heroCard.classList.remove("is-pinned"),
      });
    }, section);

    ScrollTrigger.refresh();
    return () => {
      window.removeEventListener("resize", applyVh);
      window.visualViewport?.removeEventListener("resize", applyVh);
      ScrollTrigger.removeEventListener("refresh", applyVh);
      destroyStepScrollControllers.forEach((destroy) => destroy());
      ctx.revert();
    };
  }, [stackId]);

  return (
    <section
      className={rootClassName}
      ref={sectionRef}
      style={backgroundStyle}
      data-mobile-chrome-color={mobileHeroChromeColor}
      data-mobile-chrome-top={mobileHeroChromeTopColor}
      data-mobile-chrome-bottom={mobileHeroChromeBottomColor}
    >
      {/* Static hero backdrop */}
      <article
        ref={heroCardRef}
        className="highlights-stack__card highlights-stack__card--hero"
        data-mobile-chrome-color={mobileHeroChromeColor}
        data-mobile-chrome-top={mobileHeroChromeTopColor}
        data-mobile-chrome-bottom={mobileHeroChromeBottomColor}
      >
        <div
          className="highlights-stack__heroSnapTarget"
          aria-hidden="true"
        />
        <div className="highlights-stack__heroBackdrop">
          <div
            className="highlights-stack__heroBackground"
            style={{
              backgroundImage: content.hero.backgroundImage
                ? `url("${content.hero.backgroundImage}")`
                : "none",
              backgroundColor: content.hero.backgroundColor || undefined,
            }}
          />
        </div>
      </article>

      {/* Product card */}
      <article
        ref={productCardRef}
        className="highlights-stack__card highlights-stack__card--product"
        data-mobile-chrome-color={mobileHeroChromeColor}
        data-mobile-chrome-top={mobileHeroChromeTopColor}
        data-mobile-chrome-bottom={mobileHeroChromeBottomColor}
      >
        <div
          className="highlights-stack__panelSnapTarget"
          aria-hidden="true"
        />
        <PanelShell
          panelContent={content}
          panelInfoBlocks={infoBlocks}
            headerRef={productHeaderRef}
            imageRef={productImageRef}
            companionImageRef={productCompanionImageRef}
            badgeRef={productBadgeRef}
            urlRef={productUrlRef}
            infoRefsObj={infoRefs}
            inlineTitleRefsObj={productInlineTitleRefs}
            teamIntroRef={productTeamIntroRef}
            teamCardsRef={productTeamCardsRef}
            teamLeftSlotRef={productTeamLeftSlotRef}
            teamLeftCardRef={productTeamLeftCardRef}
            teamBridgeRef={productTeamBridgeRef}
            teamConnectorRef={productTeamConnectorRef}
            teamRightCardRef={productTeamRightCardRef}
            teamRightCircleRef={productTeamRightCircleRef}
            teamIntroDescriptionRef={productTeamIntroDescriptionRef}
            teamCardsDescriptionRef={productTeamCardsDescriptionRef}
            teamInfoWindowRef={productTeamInfoWindowRef}
            carouselRef={productCarouselRef}
            prioritizeMedia
          />
      </article>

      {/* Overlay card — scrolls over the pinned hero backdrop */}
      {content.overlay ? (
        <article
          ref={overlayCardRef}
          className="highlights-stack__card highlights-stack__card--overlay"
          data-mobile-chrome-color={mobileOverlayChromeColor}
          data-mobile-chrome-top={mobileOverlayChromeTopColor}
          data-mobile-chrome-bottom={mobileOverlayChromeBottomColor}
          style={{
            backgroundColor:
              content.overlay.hero.backgroundColor || "#0d1117",
          }}
        >
          <PanelShell
            panelContent={content.overlay}
            panelInfoBlocks={overlayInfoBlocks}
            headerRef={overlayHeaderRef}
            imageRef={overlayImageRef}
            companionImageRef={overlayCompanionImageRef}
            badgeRef={overlayBadgeRef}
            urlRef={overlayUrlRef}
            infoRefsObj={overlayInfoRefs}
            inlineTitleRefsObj={overlayInlineTitleRefs}
            prioritizeMedia={false}
          />
        </article>
      ) : null}
    </section>
  );
}
