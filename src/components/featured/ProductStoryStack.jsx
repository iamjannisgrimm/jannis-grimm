import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
const TEAM_INFO_STEP = 0.45;
const TEAM_MEDIA_TEXT_GAP = 0.22;
const TEAM_INFO_EXIT_GAP = 0.38;

const TARS_TRANSITION_PROMPTS = [
  ["Run my morning operator brief", 8, 14, "blue", "sm"],
  ["Summarize tonight's execution", 23, 9, "slate", "md"],
  ["Find AI/product jobs that fit me", 48, 11, "orange", "lg"],
  ["Check OpenClaw health at 11", 74, 12, "purple", "md"],
  ["Resolve the mem:// context refs", 91, 18, "blue", "sm"],
  ["Show which agent touched this", 14, 29, "green", "md"],
  ["Tailor my resume to this link", 34, 24, "slate", "sm"],
  ["Use the Gmail credential ref", 62, 25, "orange", "md"],
  ["Check portfolio dashboard visits", 84, 31, "blue", "lg"],
  ["Emit a calendar-event digest", 6, 46, "purple", "md"],
  ["Check context health before handoff", 25, 43, "blue", "lg"],
  ["Close this sprint with a snapshot", 45, 39, "green", "md"],
  ["Turn this sketch into a UI pass", 67, 42, "slate", "sm"],
  ["Open the site and run browser QA", 92, 47, "orange", "md"],
  ["Draft the reply, wait for approval", 16, 62, "purple", "lg"],
  ["Move this card to ready with DoD", 38, 58, "blue", "md"],
  ["Execute the first ready TARS card", 61, 60, "green", "lg"],
  ["Record what shipped this sprint", 82, 64, "slate", "md"],
  ["Check Gmail and tomorrow's calendar", 10, 78, "orange", "sm"],
  ["Recover Google OAuth if it broke", 30, 83, "blue", "md"],
  ["Send the resume PDF back to me", 53, 79, "purple", "md"],
  ["Refresh the safe control mirror", 73, 84, "green", "sm"],
  ["Pull AI news from approved sources", 89, 77, "purple", "md"],
  ["Shape a SeeMe growth experiment", 19, 18, "orange", "md"],
  ["Check MoltGuard before installing", 40, 17, "green", "sm"],
  ["Help with a verification-code login", 57, 17, "slate", "sm"],
  ["Search X for coach-market signals", 79, 22, "purple", "md"],
  ["Run automation-scheduler doctor", 18, 38, "blue", "sm"],
  ["Query the Kanban board state", 52, 31, "green", "md"],
  ["Capture proof from browser QA", 73, 36, "orange", "sm"],
  ["Count today's GitHub contributions", 28, 52, "slate", "md"],
  ["Route this to the right owner", 50, 51, "blue", "xl"],
  ["Schedule this recurring workflow", 72, 53, "purple", "lg"],
  ["Diagnose the Claw control plane", 47, 70, "orange", "xl"],
  ["Reset the Mac workspace safely", 68, 72, "blue", "lg"],
  ["Triage LinkedIn recruiter messages", 12, 88, "green", "md"],
  ["Prepare a local application packet", 88, 89, "purple", "sm"],
];

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
      media: info?.querySelector(".highlights-stack__infoMedia, .tars-product-slice") || null,
      content: info?.querySelector(".highlights-stack__infoContent") || null,
    }));
    if (teamIntro?.cards) {
      gsap.set(teamIntro.cards, { "--team-title-opacity": 0 });
    }

    infos.forEach((info, index) => {
      if (info) gsap.set(info, { opacity: 0, y: 28 + index * 8, zIndex: 1 });
    });
    teamInfoItems.forEach(({ root }) => {
      if (root) gsap.set(root, { "--team-info-title-opacity": 0 });
    });

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
        if (teamIntro.rightCard) {
          gsap.set(teamIntro.rightCard, {
            opacity: 0,
            y: 18,
            scale: 1,
            transformOrigin: "center center",
          });
        }
        if (teamIntro.infoWindow) gsap.set(teamIntro.infoWindow, { opacity: 0, y: 24 });
        if (hasTeamMediaSequence) {
          teamInfoItems.forEach(({ root, media, content }) => {
            if (root) gsap.set(root, { opacity: 0, y: 0, zIndex: 1 });
            if (media) {
              gsap.set(media, {
                opacity: 0,
                y: 58,
                scale: 0.98,
                "--agent-lines-opacity": 0,
              });
            }
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
      if (teamIntro.cards) {
        tl.to(teamIntro.cards, {
          "--team-title-opacity": 1,
          duration: 0.14,
          ease: "power1.out",
        }, 0.82);
      }

      if (isMobileTeamScene) {
        if (teamIntro.cards) {
          tl.to(teamIntro.cards, {
            "--team-title-opacity": 0,
            duration: 0.12,
            ease: "power1.inOut",
          }, teamCardsExitStart);
        }
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
          opacity: 0,
          duration: 0.22,
          ease: "power1.inOut",
        }, teamSoloStart);
      } else {
        if (teamIntro.cards) {
          tl.to(teamIntro.cards, {
            "--team-title-opacity": 0,
            duration: 0.12,
            ease: "power1.inOut",
          }, teamCardsExitStart);
        }
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
        if (hasTeamMediaSequence) {
          tl.to(teamIntro.rightCard, {
            x: desktopCardCenterX,
            y: 0,
            scale: 0.86,
            duration: 0.38,
            ease: "power3.inOut",
          }, teamSoloStart);
        } else {
          tl.to(teamIntro.rightCard, {
            opacity: 0,
            duration: 0.22,
            ease: "power1.inOut",
          }, teamSoloStart);
        }
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
          const isConnectionMap = root?.classList.contains("highlights-stack__infoBlock--connectionMap");
          const isFinalInfoItem = index === teamInfoItems.length - 1;
          const mediaExitStart = content && !isConnectionMap ? textStart : exitStart;
          const contentStart = isConnectionMap ? imageStart + 0.22 : textStart + 0.03;

          if (index === 0 && teamIntro.rightCard) {
            tl.to(teamIntro.rightCard, {
              opacity: 0,
              scale: hasTeamMediaSequence ? 0.8 : 0.94,
              duration: 0.14,
              ease: "power1.inOut",
            }, imageStart - 0.1);
          }
          if (root) {
            tl.to(root, {
              opacity: 1,
              y: 0,
              zIndex: 3,
              "--team-info-title-opacity": 1,
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
              "--agent-lines-opacity": 1,
              duration: 0.18,
              ease: "power1.out",
            }, imageStart + 0.2);
            if (!isFinalInfoItem) {
              tl.to(media, {
                opacity: 0,
                y: -22,
                scale: 0.98,
                "--agent-lines-opacity": 0,
                duration: 0.14,
                ease: "power1.inOut",
              }, mediaExitStart);
            }
          }
          if (content) {
            tl.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.18,
              ease: "power2.out",
            }, contentStart);
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
              zIndex: 1,
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

function AgentConnectionMap({ rows, prioritizeMedia }) {
  const top = Array.isArray(rows?.top) ? rows.top : [];
  const bottom = Array.isArray(rows?.bottom) ? rows.bottom : [];
  const topXs = top.map((_, index) => ((index + 0.5) / Math.max(top.length, 1)) * 100);
  const bottomXs = bottom.map((_, index) => ((index + 0.5) / Math.max(bottom.length, 1)) * 100);

  return (
    <div className="highlights-stack__infoMedia highlights-stack__agentConnectionMap" aria-hidden="true">
      <div className="highlights-stack__agentConnectionRow highlights-stack__agentConnectionRow--top">
        {top.map((media, mediaIndex) => (
          <div
            className="highlights-stack__infoMediaCell highlights-stack__agentConnectionCell"
            key={`source-${media.alt || "agent"}-${mediaIndex}`}
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
      <div className="highlights-stack__agentConnectionLane">
        <svg
          className="highlights-stack__agentConnectionLines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          focusable="false"
        >
          {topXs.flatMap((fromX, topIndex) =>
            bottomXs.map((toX, bottomIndex) => (
              <line
                key={`${topIndex}-${bottomIndex}`}
                x1={fromX}
                y1="0"
                x2={toX}
                y2="100"
              />
            )),
          )}
        </svg>
      </div>
      <div className="highlights-stack__agentConnectionRow highlights-stack__agentConnectionRow--bottom">
        {bottom.map((media, mediaIndex) => (
          <div
            className="highlights-stack__infoMediaCell highlights-stack__agentConnectionCell"
            key={`target-${media.alt || "agent"}-${mediaIndex}`}
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
    </div>
  );
}

function OpsDashboardPreview({ dashboard }) {
  const columns = Array.isArray(dashboard?.columns) ? dashboard.columns : [];
  const graph = Array.isArray(dashboard?.graph) ? dashboard.graph : [];
  const metrics = Array.isArray(dashboard?.metrics) ? dashboard.metrics : [];
  const graphPoints = graph.length
    ? graph
        .map((value, index) => {
          const x = graph.length === 1 ? 50 : (index / (graph.length - 1)) * 100;
          const y = 92 - Math.max(0, Math.min(100, value));
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ")
    : "0,78 18,62 35,70 54,42 72,52 100,24";

  return (
    <div className="highlights-stack__opsDashboard" aria-hidden="true">
      <div className="highlights-stack__opsDashboardGlow" />
      <div className="highlights-stack__opsDashboardTopbar">
        <div>
          <span className="highlights-stack__opsKicker">{dashboard?.pulse || "Command center"}</span>
          <strong>Ops board</strong>
        </div>
        <span className="highlights-stack__opsCadence">{dashboard?.cadence || "Synthetic sample data"}</span>
      </div>

      <div className="highlights-stack__opsBoard" role="presentation">
        {columns.map((column) => (
          <section className="highlights-stack__opsColumn" data-tone={column.tone} key={column.title}>
            <header className="highlights-stack__opsColumnHead">
              <span>{column.title}</span>
              <i>{column.count}</i>
            </header>
            <div className="highlights-stack__opsCards">
              {(column.cards || []).map((card) => (
                <article className="highlights-stack__opsCard" key={`${column.title}-${card.title}`}>
                  <div className="highlights-stack__opsCardMeta">
                    <span className="highlights-stack__opsAgent">{card.agent}</span>
                    <span className="highlights-stack__opsStatus">{card.status}</span>
                  </div>
                  <p>{card.title}</p>
                  <div className="highlights-stack__opsCardFooter">
                    <span>{card.age}</span>
                    <b style={{ "--ops-progress": `${card.progress || 0}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="highlights-stack__opsProofRow">
        <div className="highlights-stack__opsGraph">
          <div className="highlights-stack__opsGraphHeader">
            <span>Aging / flow pulse</span>
            <strong>healthy</strong>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <polyline points={graphPoints} />
          </svg>
        </div>
        <div className="highlights-stack__opsMetrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tarsBoardColumns = [
  {
    title: "todo",
    description: "Raw captures waiting for shape",
    count: 22,
    cards: [
      { epic: "TARS Improvements", title: "Weekly TARS synthesis report", summary: "Summarize the week into one calm operator report with open questions and what is coming next.", priority: "high", assignee: "TARS", dependencies: "Ready" },
      { epic: "Operator Planning", title: "Private extraction planning model", summary: "Portfolio-safe card based on the live board; sensitive finance details stay private.", priority: "high", assignee: "Jannis", dependencies: "Blocked by 1" },
      { epic: "TARS Improvements", title: "Async task handoff mode", summary: "Call an agent with a scoped task, disconnect, and let work continue to completion.", priority: "high", assignee: "TARS", dependencies: "Ready" },
    ],
  },
  {
    title: "ready",
    description: "Approved work that can run",
    count: 0,
    cards: [],
  },
  {
    title: "in progress",
    description: "Active work in motion",
    count: 8,
    cards: [
      { epic: "TARS Improvements", title: "Voice/phone integration lane", summary: "Use a dedicated number as the operator-facing path into TARS.", priority: "high", assignee: "TARS", dependencies: "Ready", live: true },
      { epic: "OpenClaw Systems", title: "Private vs open model routing guide", summary: "Document when work should stay local/private versus use the open model path.", priority: "high", assignee: "TARS", dependencies: "Ready" },
      { epic: "Security Hygiene", title: "Credential surface cleanup", summary: "Harden password/key/payment references without exposing raw secrets in UI or logs.", priority: "high", assignee: "Security", dependencies: "Ready" },
    ],
  },
  {
    title: "done review",
    description: "Completed in the last day",
    count: 7,
    cards: [
      { epic: "TARS Improvements", title: "Stop-working control", summary: "Added an operator command path for halting work cleanly.", priority: "high", assignee: "TARS", dependencies: "Ready" },
      { epic: "OpenClaw Systems", title: "Full-context request flow", summary: "Improved how large-context requests are captured and routed.", priority: "high", assignee: "TARS", dependencies: "Ready" },
      { epic: "Automations", title: "Automation instance model", summary: "Split reusable workflows from scheduled automation instances.", priority: "high", assignee: "TARS", dependencies: "Ready" },
    ],
  },
  {
    title: "done",
    description: "Completed and archived",
    count: 50,
    cards: [
      { epic: "OpenClaw Systems", title: "Board bridge reliability pass", summary: "Made the control plane more durable without exposing private runtime details.", priority: "medium", assignee: "TARS", dependencies: "Ready" },
      { epic: "Portfolio", title: "TARS product story polish", summary: "Converted system capabilities into portfolio-safe visual proof.", priority: "medium", assignee: "TARS", dependencies: "Ready" },
    ],
  },
  {
    title: "blocked",
    description: "Waiting on a decision or dependency",
    count: 0,
    cards: [],
  },
];

const tarsPlanApproveNavItems = [
  ["▣", "Overview", true],
  ["◆", "Vision"],
  ["▦", "Sprint"],
  ["⌁", "Backlog"],
  ["⌘", "Agents"],
  ["◎", "Automations"],
  ["◇", "Skills"],
  ["⚙", "Tools"],
  ["✦", "Workflows"],
  ["▤", "Reports"],
];

const tarsPlanApproveColumns = [
  {
    title: "review",
    description: "Approval-gated actions waiting on Jannis",
    count: 3,
    tone: "review",
    cards: [
      { epic: "Career", title: "Founding AI Engineer — applied intelligence platform", summary: "Final application packet is ready after form discovery, tailored resume, and answer population.", priority: "high", assignee: "Career", dependencies: "Ready", actions: ["Submit"] },
      { epic: "TARS Dev", title: "TARS dev task: Plan & Approve visual update", summary: "Portfolio-safe implementation is complete; verify the Kanban-like review state before closing.", priority: "high", assignee: "Developer", dependencies: "Ready", actions: ["Revise", "Done"] },
      { epic: "Email", title: "Overnight inbound: partnership intro draft", summary: "Draft reply prepared from the message that arrived overnight; needs approval before sending.", priority: "medium", assignee: "Personal", dependencies: "Ready", actions: ["Send", "Revise"] },
    ],
  },
  {
    title: "ready",
    description: "Approved work that can run",
    count: 2,
    cards: [
      { epic: "TARS Improvements", title: "Morning synthesis report", summary: "Compile overnight agent activity into one operator-ready summary with artifacts and open decisions.", priority: "high", assignee: "TARS", dependencies: "Ready" },
      { epic: "Automations", title: "Portfolio early-access follow-up", summary: "Prepare a private draft response for new early-access requests without sending externally.", priority: "medium", assignee: "Personal", dependencies: "Ready" },
    ],
  },
  {
    title: "in progress",
    description: "Active work in motion",
    count: 2,
    cards: [
      { epic: "OpenClaw Systems", title: "Agent session tail polish", summary: "Surface live agent progress, tool use, and handoffs in a compact dashboard trace.", priority: "high", assignee: "TARS", dependencies: "Ready", live: true },
      { epic: "Security Hygiene", title: "Credential reference audit", summary: "Verify sensitive automation paths use references instead of raw secrets.", priority: "high", assignee: "Security", dependencies: "Ready" },
    ],
  },
];

const tarsAgents = [
  { id: "tars", name: "TARS", headline: "Entrypoint / router / orchestrator", role: "Runtime compatibility still enters through personal-assistant, but the visible identity is TARS: it loads context, chooses a domain owner, then synthesizes verified results.", tier: "tars", tone: "110, 110, 115", image: "/images/TARSAgents/TARS.png", live: true },
  { id: "seeme", name: "SeeMe", headline: "Domain owner", role: "Owns SeeMe product truth, roadmap, launch readiness, coach strategy, user-growth priorities, and product/brand judgment before specialists execute.", tier: "domain", tone: "255, 77, 112", image: "/images/TARSAgents/seeme-default-256.png" },
  { id: "personal", name: "Personal Assistant / Personal", headline: "Domain owner", role: "Owns life admin, calendar, email, wedding, portfolio admin, reminders, travel, finance coordination, personal projects, and daily logistics.", tier: "domain", tone: "0, 113, 227", image: "/images/TARSAgents/personal-default-256.png" },
  { id: "career", name: "Career", headline: "Domain owner", role: "Owns resume automation, job search, applications, interview prep, portfolio positioning, LinkedIn/profile maintenance, and career documents.", tier: "domain", tone: "255, 214, 10", image: "/images/TARSAgents/career-default-256.png" },
  { id: "claw", name: "Claw / OpenClaw Systems", headline: "Domain owner", role: "Owns OpenClaw runtime, agents, skills, tools, workflows, automations, routing, dashboards, memory, A2A, and control-plane work.", tier: "domain", tone: "255, 149, 0", image: "/images/TARSAgents/ClawLight.png" },
  { id: "developer", name: "Developer", headline: "Reusable specialist", role: "Owns implementation/build/refactor/debug/test/code-change slices for any domain owner, then returns proof upward.", tier: "specialist", tone: "63, 70, 80", image: "/images/TARSAgents/DevLight.png", live: true },
  { id: "marketer", name: "Marketer", headline: "Reusable specialist", role: "Shapes messaging, launch, content, brand, positioning, campaigns, founder voice, and communications strategy.", tier: "specialist", tone: "255, 45, 85", image: "/images/TARSAgents/MarketerLight.png" },
  { id: "research", name: "Research", headline: "Reusable specialist", role: "Runs deep investigation, evidence gathering, source comparison, and synthesis for domain-owner decisions.", tier: "specialist", tone: "175, 82, 222", image: "/images/TARSAgents/ResearcherLight.png" },
  { id: "news-retriever", name: "News Retriever", headline: "Reusable source provider", role: "Retrieves approved world-news and AI/technology signals, transcripts, source-quality notes, digests, and artifacts.", tier: "specialist", tone: "139, 94, 52", image: "/images/TARSAgents/news-retriever-default-256.png" },
  { id: "legal", name: "Legal", headline: "Reusable support provider", role: "Spots legal risk and prepares policy, contract, privacy, compliance, and counsel-ready legal-ops artifacts without acting as counsel.", tier: "specialist", tone: "36, 40, 46", image: "/images/TARSAgents/law-light.png" },
  { id: "security", name: "Security", headline: "Reusable support provider", role: "Reviews credentials/secrets hygiene, auth/session safety, threat models, hardening, privacy/security, supply chain, and incident triage.", tier: "specialist", tone: "255, 179, 64", image: "/images/TARSAgents/security-light.png" },
  { id: "frontend-developer", name: "frontend-developer", headline: "Developer-owned subagent", role: "Implements polished browser-visible UI from scoped packets and existing design systems; not a top-level route.", tier: "developer-subagent", tone: "10, 132, 255" },
  { id: "backend-developer", name: "backend-developer", headline: "Developer-owned subagent", role: "Handles APIs, databases, migrations, integrations, MCP/server tooling, and backend verification under Developer.", tier: "developer-subagent", tone: "94, 106, 210" },
];

const tarsAutomationDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const tarsAutomationHours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const tarsAutomationEvents = [
  { title: "Card Executor", days: "daily", start: 0, duration: 3, recurrence: "12:00–3:00 AM", lane: "dw", color: "#8b7cff" },
  { title: "Career Job Discovery", days: "daily", start: 3, duration: 2, recurrence: "3:00–5:00 AM", lane: "dw", color: "#ffd36a" },
  { title: "News", days: "daily", start: 5, duration: 1, recurrence: "5:00 AM", lane: "main", color: "#64d2ff" },
  { title: "Morning GUI Window Cleanup", days: "daily", start: 5.5, duration: 0.75, recurrence: "5:30 AM", lane: "main", color: "#ffb340" },
  { title: "Daily Morning", days: "daily", start: 6, duration: 1, recurrence: "6:00 AM", lane: "main", color: "#4be37d" },
  { title: "Evening Report", days: "daily", start: 20, duration: 1, recurrence: "8:00 PM", lane: "main", color: "#d78cff" },
  { title: "Daily Claw", days: "daily", start: 21, duration: 3, recurrence: "Daily 9:00 PM–12:00 AM", lane: "main", color: "#8b5e34" },
  { title: "Sprint Closing Workflow", day: 6, start: 19.5, duration: 1, recurrence: "Sunday 7:30 PM", lane: "main", color: "#ff5f7a" },
];

const tarsAutomationCalendarEvents = tarsAutomationEvents.flatMap((event) => (
  event.days === "daily"
    ? tarsAutomationDays.map((_, day) => ({ ...event, day, key: `${event.title}-${day}` }))
    : [{ ...event, key: event.title }]
));

function doAutomationEventsOverlap(a, b) {
  return a.start < b.start + b.duration && b.start < a.start + a.duration;
}

function layoutAutomationCalendarEvents(events) {
  const sortedEvents = events
    .map((event, index) => ({ ...event, originalIndex: index }))
    .sort((a, b) => a.start - b.start || (b.duration - a.duration));

  const laidOutEvents = [];
  let group = [];
  let groupEnd = -Infinity;

  const flushGroup = () => {
    if (!group.length) return;

    const columns = [];
    const assigned = group.map((event) => {
      const end = event.start + event.duration;
      const columnIndex = columns.findIndex((columnEnd) => columnEnd <= event.start);
      const nextColumnIndex = columnIndex === -1 ? columns.length : columnIndex;
      columns[nextColumnIndex] = end;
      return { ...event, automationColumnIndex: nextColumnIndex };
    });
    const columnCount = Math.max(columns.length, 1);

    laidOutEvents.push(...assigned.map((event) => ({
      ...event,
      automationColumnCount: columnCount,
      automationColumnLeft: columnCount > 1 ? `${(event.automationColumnIndex / columnCount) * 100}%` : "0%",
      automationColumnWidth: columnCount > 1 ? `${100 / columnCount}%` : "100%",
    })));

    group = [];
    groupEnd = -Infinity;
  };

  sortedEvents.forEach((event) => {
    const eventEnd = event.start + event.duration;
    if (!group.length || group.some((groupEvent) => doAutomationEventsOverlap(groupEvent, event))) {
      group.push(event);
      groupEnd = Math.max(groupEnd, eventEnd);
      return;
    }

    if (event.start < groupEnd) {
      group.push(event);
      groupEnd = Math.max(groupEnd, eventEnd);
      return;
    }

    flushGroup();
    group.push(event);
    groupEnd = eventEnd;
  });

  flushGroup();

  return laidOutEvents.sort((a, b) => a.originalIndex - b.originalIndex);
}

const tarsAutomationMondayEvents = layoutAutomationCalendarEvents(
  tarsAutomationCalendarEvents.filter((event) => event.day === 0)
);

function BoardCard({ card }) {
  const epicClass = String(card.epic || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <article className={`card tars-board-card tars-board-card--${epicClass}${card.live ? " is-live" : ""}${card.actions?.length ? " tars-board-card--needs-review" : ""}`} role="listitem">
      <div className="card-epic-tag tars-board-epic">{card.epic}</div>
      <h4 className="card-title">{card.title}</h4>
      <p className="card-summary">{card.summary}</p>
      <div className="card-meta-row">
        <div className={`card-assignee-avatar assignee-${String(card.assignee).toLowerCase()}`}><span>{String(card.assignee || "T").charAt(0)}</span></div>
        <div className={`card-priority-tag priority-${card.priority}`}>{card.priority}</div>
        <div className={`card-dependency-tag ${card.dependencies?.startsWith("Blocked") ? "is-blocked" : "is-ready"}`}>{card.dependencies}</div>
      </div>
      {card.actions?.length ? (
        <div className="tars-board-review-actions" aria-label={`${card.title} review actions`}>
          {card.actions.map((action) => (
            <button className={`tars-board-review-button ${["Submit", "Send", "Done"].includes(action) ? "is-primary" : "is-secondary"}`} type="button" key={action}>{action}</button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

const tarsSecurityModelCards = [
  { label: "Local model", model: "DeepSeek R1-70B", task: "Private route", tone: "52,199,89" },
  { label: "Memory option", model: "Permissioned local memory", task: "Off, scoped, or durable", tone: "100,168,255" },
  { label: "Open model", model: "Opus 4.7", task: "Frontier route", tone: "175,82,222" },
];

function TarsAgentsTabSlice() {
  const tars = tarsAgents.find((agent) => agent.tier === "tars");
  const domainOrder = ["career", "seeme", "personal", "claw"];
  const domainAgents = tarsAgents
    .filter((agent) => agent.tier === "domain")
    .sort((a, b) => domainOrder.indexOf(a.id) - domainOrder.indexOf(b.id));
  const specialistOrder = ["marketer", "developer", "research", "news-retriever", "legal", "security"];
  const specialistAgents = tarsAgents
    .filter((agent) => agent.tier === "specialist")
    .sort((a, b) => specialistOrder.indexOf(a.id) - specialistOrder.indexOf(b.id));
  const developerSubagents = tarsAgents.filter((agent) => agent.tier === "developer-subagent");
  const activeNodeIds = new Set(["tars", "career", "developer", "frontend-developer"]);

  const agentNetworkGraph = (className = "") => (
    <div className={`tars-agent-network tars-agent-network--dark-cell${className ? ` ${className}` : ""}`} data-agent-graph="openclaw-agents">
      <svg className="tars-agent-connectors" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
        <path className="is-live-active" data-edge="tars-career" d="M500 122 C305 132 176 144 125 166" />
        <path data-edge="tars-seeme" d="M500 122 C420 136 392 148 375 166" />
        <path data-edge="tars-personal" d="M500 122 C580 136 608 148 625 166" />
        <path data-edge="tars-claw" d="M500 122 C695 132 824 144 875 166" />
        <path data-edge="career-marketer" d="M125 250 C112 274 96 282 84 292" />
        <path className="is-live-active" data-edge="career-developer" d="M125 250 C150 272 206 282 250 292" />
        <path data-edge="seeme-research" d="M375 250 C392 274 408 282 417 292" />
        <path data-edge="personal-news-retriever" d="M625 250 C608 274 592 282 583 292" />
        <path data-edge="claw-security" d="M875 250 C850 272 794 282 750 292" />
        <path data-edge="claw-legal" d="M875 250 C900 272 916 282 917 292" />
        <path className="is-live-active" data-edge="developer-frontend-developer" d="M250 376 C226 396 196 408 170 418" />
        <path data-edge="developer-backend-developer" d="M250 376 C274 396 304 408 330 418" />
      </svg>
      <div className="tars-agent-tier tars-agent-tier--tars">
        <div className={`tars-agent-tab-node tars-agent-tab-node--tars${activeNodeIds.has("tars") ? " is-live-active" : ""}`} style={{ "--agent-rgb": tars?.tone }}>
          <div className="tars-agent-tab-orb"><img src={tars?.image} alt="" /></div>
          <strong>{tars?.name}</strong>
        </div>
      </div>
      <div className="tars-agent-row tars-agent-row--domains">
        {domainAgents.map((agent) => (
          <div className={`tars-agent-tab-node${activeNodeIds.has(agent.id) ? " is-live-active" : ""}`} style={{ "--agent-rgb": agent.tone }} key={agent.id}>
            <div className="tars-agent-tab-orb"><img src={agent.image} alt="" /></div>
            <strong>{agent.name}</strong>
          </div>
        ))}
      </div>
      <div className="tars-agent-row tars-agent-row--specialists">
        {specialistAgents.map((agent) => (
          <div className={`tars-agent-tab-node${activeNodeIds.has(agent.id) ? " is-live-active" : ""}`} style={{ "--agent-rgb": agent.tone }} key={agent.id}>
            <div className="tars-agent-tab-orb"><img src={agent.image} alt="" /></div>
            <strong>{agent.name}</strong>
          </div>
        ))}
      </div>
      <div className="tars-agent-row tars-agent-row--developer-subagents">
        {developerSubagents.map((agent) => (
          <div className={`tars-agent-tab-node tars-agent-tab-node--subagent${activeNodeIds.has(agent.id) ? " is-live-active" : ""}`} style={{ "--agent-rgb": agent.tone }} key={agent.id}>
            <div className="tars-agent-tab-orb"><span>{agent.name.slice(0, 2).toUpperCase()}</span></div>
            <strong>{agent.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tars-product-slice tars-product-slice--agents-tab" aria-hidden="true">
      <section className="tars-agents-tab-main">
        <div className="tars-agent-lane-board">
          <header className="tars-agents-tab-header" data-agent-section-title="agents">
            <div>
              <h3>Agentic.</h3>
              <p>TARS uses the A2A protocol to pass scoped task packets between domain agents, reusable specialists, and implementation subagents.</p>
            </div>
          </header>
          <div className="tars-agentic-spawn-stage" aria-hidden="true">
            {agentNetworkGraph()}
            <div className="tars-agentic-spawn-label">
              <span>Instance fan-out</span>
              <strong>Spin up the exact agents this task needs.</strong>
            </div>
            {[1, 2, 3].map((instance) => (
              <div className={`tars-agentic-spawn-clone tars-agentic-spawn-clone--${instance}`} key={instance}>
                {agentNetworkGraph("tars-agent-network--spawn-clone")}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TarsVisionSlice() {
  return (
    <div className="tars-product-slice tars-product-slice--vision" aria-hidden="true">
      <div className="tars-vision-visualEdge" data-vision-visual-edge="command-center">
        <div className="tars-vision-visualCrop">
          <TarsBoardProductSlice kind="command-center" />
        </div>
      </div>
      <section className="tars-vision-copy" data-vision-copy="primary">
        <h3 className="tars-vision-title">Plan &amp; Approve</h3>
        <p className="tars-vision-description">
          TARS routes intent, proposes a plan, waits for approval when actions cross a boundary, then executes with artifacts and proof.
        </p>
      </section>
    </div>
  );
}

function TarsEarlyAccessSlice() {
  const [email, setEmail] = useState("");
  const [interestType, setInterestType] = useState("personal");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("Add an email so I know where to follow up.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("https://dashboard.iamjannisgrimm.com/api/journey-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          quote: "TARS early access request",
          source: "portfolio-tars-early-access",
          sourcePath: typeof window !== "undefined" ? window.location.pathname : "/",
          sourceType: "tars_early_access",
          interestType,
        }),
      });

      if (!response.ok) {
        throw new Error("Early access request failed");
      }

      setEmail("");
      setStatus("You are on the list. I will follow up directly.");
    } catch {
      setStatus("Something went sideways. Try again in a moment or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tars-product-slice tars-product-slice--early-access">
      <div className="tars-early-access-copy">
        <span>Private operating system</span>
        <h3>Your private work OS.</h3>
        <p>
          I am opening a small early-access lane for people and organizations who want a private AI operating system around their tools, memory, automations, and execution workflows.
        </p>
      </div>
      <form className="tars-early-access-form" onSubmit={handleSubmit}>
        <fieldset className="tars-early-access-interest" aria-label="Interest type">
          {["personal", "business"].map((option) => (
            <label className={interestType === option ? "is-selected" : ""} key={option}>
              <input
                type="radio"
                name="interestType"
                value={option}
                checked={interestType === option}
                onChange={() => setInterestType(option)}
              />
              <span>{option === "personal" ? "Personal" : "Business"}</span>
            </label>
          ))}
        </fieldset>
        <label htmlFor="tars-early-access-email">Email</label>
        <div className="tars-early-access-row">
          <input
            id="tars-early-access-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending" : "Request access"}</button>
        </div>
        <p className={`tars-early-access-status${status ? " is-visible" : ""}`} aria-live="polite">{status}</p>
        <small>No spam, no public launch list theatrics — just a direct early-access conversation.</small>
      </form>
    </div>
  );
}

function TarsSecuritySlice() {
  const localModelCard = tarsSecurityModelCards.find((card) => card.label === "Local model");
  const openModelCards = tarsSecurityModelCards.filter((card) => card.label !== "Local model");

  return (
    <div className="tars-product-slice tars-product-slice--security" aria-hidden="true">
      <section className="tars-security-copy">
        <h3 className="tars-security-title">Security by routing.</h3>
        <p className="tars-security-description">
          Different models handle different tasks and agents. Memory is optional and permissioned, files and tools stay locked unless an agent has access, and the whole system runs on hardware I control.
        </p>
      </section>
      <div className="tars-security-visualEdge" aria-label="TARS security routing visual">
        <div className="tars-security-visualCard">
          <div className="tars-security-core" aria-hidden="true">
            <div className="tars-security-shield">
              <span className="tars-security-shield-mark"> M5</span>
              <strong>48GB RAM</strong>
              <small>protected local hardware + memory cell</small>
            </div>
            {localModelCard ? (
              <article className="tars-security-route-card tars-security-route-card--local" style={{ "--security-rgb": localModelCard.tone }}>
                <span>{localModelCard.label}</span>
                <strong>{localModelCard.model}</strong>
                <small>{localModelCard.task}</small>
              </article>
            ) : null}
          </div>
          <div className="tars-security-branches" aria-hidden="true">
            <span />
          </div>
          <div className="tars-security-route-grid" role="list" aria-label="Model route and memory options">
            {openModelCards.map((card) => (
              <article className="tars-security-route-card" style={{ "--security-rgb": card.tone }} key={card.label} role="listitem">
                <span>{card.label}</span>
                <strong>{card.model}</strong>
                <small>{card.task}</small>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TarsAutomationCalendarSlice() {
  return (
    <div className="tars-product-slice tars-product-slice--automation-calendar" aria-hidden="true">
      <section className="tars-automation-copy">
        <h3>Automation.</h3>
        <p>
          TARS keeps the repeatable parts of my work moving on schedule: night execution, career scans,
          news retrieval, morning cleanup, and the daily operator brief — without turning my calendar into
          a wall of noise.
        </p>
      </section>
      <section className="automation-calendar-shell" aria-label="Monday automation schedule">
        <div className="automation-calendar-grid">
          <div className="automation-calendar-header">
            <div className="automation-calendar-header-spacer" />
            <div className="automation-calendar-day-head automation-calendar-day-head--monday" style={{ gridColumn: 2 }}>
              <span>Monday</span>
              <strong>Operating rhythm</strong>
            </div>
          </div>
          <div className="automation-calendar-body" role="list">
            <div className="automation-calendar-time-rail"><div className="automation-calendar-time-track">{tarsAutomationHours.map((hour) => <span key={hour} style={{ "--time-top": `${(hour / 24) * 100}%` }}>{String(hour).padStart(2, "0")}:00</span>)}</div></div>
            <div className="automation-calendar-day automation-calendar-day--monday" style={{ gridColumn: 2 }}>
              <div className="automation-calendar-day-track">
                {tarsAutomationMondayEvents.map((event) => (
                  <article className={`automation-calendar-block automation-instance-${event.lane}${event.duration <= 1 ? " automation-calendar-block-short" : event.duration >= 1.25 ? " automation-calendar-block-roomy" : ""}`} key={event.key} style={{ "--automation-top": `${(event.start / 24) * 100}%`, "--automation-duration-hours": event.duration, "--automation-display-color": event.color, "--automation-column-left": event.automationColumnLeft, "--automation-column-width": event.automationColumnWidth }}>
                    <div className="automation-calendar-block-visible"><h3>{event.title}</h3></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TarsBoardProductSlice({ kind }) {
  if (kind === "agents-tab") {
    return <TarsAgentsTabSlice />;
  }

  if (kind === "vision") {
    return <TarsVisionSlice />;
  }

  if (kind === "command-center") {
    return (
      <div className="tars-product-slice tars-product-slice--board" aria-hidden="true">
        <aside className="tars-product-sidebar">
          <div className="tars-product-brand"><span><img src="/images/me/JannisGrimm.png" alt="" /></span><strong>Jannis</strong><small>CEO</small></div>
          {tarsPlanApproveNavItems.map(([icon, label, active]) => (
            <span className={`tars-product-tab${active ? " is-active" : ""}`} key={label}><i>{icon}</i>{label}</span>
          ))}
        </aside>
        <section className="tars-product-main">
          <header className="tars-product-section-header section-header"><h3>Overview</h3><button className="universal-create-trigger">+</button></header>
          <div className="board tars-board-columns" role="list">
            {tarsPlanApproveColumns.map((column) => (
              <section className="column tars-board-column" data-column-tone={column.tone || column.title} key={column.title}>
                <div className="column-head"><div><h3>{column.title}</h3><p>{column.description}</p></div><span className="count">{column.count}</span></div>
                <div className="cards">{column.cards.length ? column.cards.map((card) => <BoardCard card={card} key={card.title} />) : <div className="empty-state">No cards in this column yet.</div>}</div>
              </section>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (kind === "automation-cleaner") {
    return <TarsAutomationCalendarSlice />;
  }

  if (kind === "security") {
    return <TarsSecuritySlice />;
  }

  if (kind === "early-access") {
    return <TarsEarlyAccessSlice />;
  }

  return (
    <div className="tars-product-slice tars-product-slice--architecture" aria-hidden="true">
      <div className="tars-architecture-hero">
        <span>Privacy & Architecture</span>
        <h3>Useful autonomy, boxed by design.</h3>
        <p>Private intent enters locally, agents receive scoped packets, tools use credential references, and anything external stays approval-gated.</p>
      </div>
      <div className="tars-architecture-grid">
        <article><span>01</span><strong>Operator surface</strong><small>Messages and browser inputs become sanitized intent, not public telemetry.</small></article>
        <article><span>02</span><strong>Router + memory</strong><small>Open/private model paths, memory, and context are selected before work fans out.</small></article>
        <article><span>03</span><strong>Scoped agents</strong><small>Specialists inherit only the task packet, relevant files, and allowed tools.</small></article>
        <article><span>04</span><strong>Proof trail</strong><small>Cards, artifacts, verification, commits, and logs close the loop without exposing secrets.</small></article>
      </div>
      <div className="tars-privacy-rails"><span>Credential refs only</span><span>Approval-gated external actions</span><span>Synthetic portfolio data</span><span>No private live logs</span></div>
    </div>
  );
}

function TarsTransitionStorm() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return undefined;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const stage = sectionRef.current.querySelector(".tars-prompt-storm__stage");
      const headline = sectionRef.current.querySelector(".tars-prompt-storm__headline");
      const prompts = gsap.utils.toArray(".tars-prompt-storm__prompt", sectionRef.current);

      if (prefersReducedMotion) {
        sectionRef.current.classList.remove("is-initializing");
        sectionRef.current.classList.add("is-ready");
        sectionRef.current.classList.add("is-visible");
        gsap.set(stage, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
        gsap.set(headline, { opacity: 1, y: 0, scale: 1 });
        gsap.set(prompts, { opacity: 1, xPercent: -50, yPercent: -50, x: 0, y: 0, z: 0, scale: 1, filter: "blur(0px)" });
        return;
      }

      const promptOffsetFor = (element) => {
        const stageRect = stage.getBoundingClientRect();
        const xPercent = Number.parseFloat(element.style.getPropertyValue("--prompt-x")) || 50;
        const yPercent = Number.parseFloat(element.style.getPropertyValue("--prompt-y")) || 50;
        return {
          x: (xPercent / 100 - 0.5) * stageRect.width,
          y: (yPercent / 100 - 0.5) * stageRect.height,
        };
      };

      gsap.set(stage, { opacity: 0, y: 0, z: -180, scale: 0.88, rotateX: 8, filter: "blur(18px)" });
      gsap.set(headline, { opacity: 0, y: 0, z: 80, scale: 0.82, rotateX: -8, filter: "blur(10px)" });
      gsap.set(prompts, {
        opacity: 0,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        z: (index) => 360 + (index % 4) * 74,
        rotation: (index) => (index % 7 - 3) * 14,
        rotationX: (index) => -24 - (index % 3) * 9,
        scale: (index) => 1.46 + (index % 3) * 0.08,
        filter: "blur(18px)",
        transformOrigin: "center center",
      });
      sectionRef.current.classList.remove("is-initializing");
      sectionRef.current.classList.add("is-ready");

      const tl = gsap.timeline({ paused: true });

      tl.to(stage, { opacity: 1, y: 0, z: 0, scale: 1, rotateX: 0, filter: "blur(0px)", duration: 0.32, ease: "expo.out" }, 0)
        .to(headline, { opacity: 1, y: 0, z: 0, scale: 1, rotateX: 0, filter: "blur(0px)", duration: 0.38, ease: "back.out(1.35)" }, 0.04)
        .to(prompts, {
          opacity: (index) => (index % 5 === 0 ? 1 : 0.9),
          x: (_index, element) => promptOffsetFor(element).x,
          y: (_index, element) => promptOffsetFor(element).y,
          z: 0,
          rotation: (index) => (index % 7 - 3) * 3,
          rotationX: 0,
          scale: (index) => (index % 6 === 0 ? 1.08 : 1),
          filter: "blur(0px)",
          duration: 0.46,
          ease: "back.out(1.6)",
          stagger: { each: 0.012, from: "center" },
        }, 0.06)
        .to(stage, { opacity: 1, duration: 0.4 }, 0.42)
        .to(headline, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, 0.42)
        .to(prompts, { opacity: (index) => (index % 5 === 0 ? 1 : 0.9), duration: 0.4 }, 0.42)
        .to(stage, { opacity: 0, y: 0, z: -220, scale: 0.84, rotateX: 8, filter: "blur(18px)", duration: 0.28, ease: "power3.in" }, 0.82)
        .to(headline, { opacity: 0, y: 0, z: -120, scale: 0.9, rotateX: -7, filter: "blur(12px)", duration: 0.24, ease: "power3.in" }, 0.82)
        .to(prompts, {
          x: 0,
          y: 0,
          z: -120,
          rotation: (index) => (index % 7 - 3) * 7,
          rotationX: (index) => 12 + (index % 3) * 5,
          scale: (index) => 0.68 + (index % 3) * 0.04,
          filter: "blur(10px)",
          duration: 0.14,
          ease: "power3.inOut",
          stagger: { each: 0.004, from: "edges" },
        }, 0.76)
        .to(prompts, {
          opacity: 0,
          x: 0,
          y: 0,
          z: (index) => -360 - (index % 4) * 78,
          rotation: (index) => (index % 7 - 3) * 13,
          rotationX: (index) => 24 + (index % 3) * 9,
          scale: (index) => 0.44 + (index % 3) * 0.04,
          filter: "blur(24px)",
          duration: 0.22,
          ease: "power3.in",
          stagger: { each: 0.008, from: "edges" },
        }, 0.88);

      const renderFromScroll = () => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        const start = viewportHeight * 0.8;
        const end = viewportHeight * 0.2 - rect.height;
        const progress = gsap.utils.clamp(0, 1, (start - rect.top) / (start - end));
        tl.progress(progress);

        if (progress > 0.02 && progress < 0.98) {
          sectionRef.current.classList.add("is-visible");
        } else {
          sectionRef.current.classList.remove("is-visible");
        }
      };

      renderFromScroll();
      window.addEventListener("scroll", renderFromScroll, { passive: true });
      window.addEventListener("resize", renderFromScroll);

      return () => {
        window.removeEventListener("scroll", renderFromScroll);
        window.removeEventListener("resize", renderFromScroll);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tars-prompt-storm is-initializing" aria-label="TARS prompt routing transition" ref={sectionRef}>
      <div className="tars-prompt-storm__stage">
        <div className="tars-prompt-storm__field">
          {TARS_TRANSITION_PROMPTS.map(([prompt, x, y, tone, size], index) => (
            <span
              className={`tars-prompt-storm__prompt tars-prompt-storm__prompt--${tone} tars-prompt-storm__prompt--${size}`}
              style={{
                "--prompt-x": `${x}%`,
                "--prompt-y": `${y}%`,
                "--prompt-rotate": `${(index % 7 - 3) * 3}deg`,
              }}
              key={prompt}
            >
              <span className="tars-prompt-storm__promptText">{prompt}</span>
            </span>
          ))}
        </div>
        <div className="tars-prompt-storm__headline">
          <span>handoff beat</span>
          <strong>Every task finds its agent.</strong>
        </div>
      </div>
    </section>
  );
}

function TarsScrollSections({ blocks }) {
  const sectionsRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionsRef.current) return undefined;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const agenticSection = sectionsRef.current.querySelector(".tars-scroll-section--agents-tab");
      if (!agenticSection) return;

      const board = agenticSection.querySelector(".tars-agent-lane-board");
      const header = agenticSection.querySelector(".tars-agents-tab-header");
      const graph = agenticSection.querySelector(".tars-agentic-spawn-stage > .tars-agent-network");
      const clones = gsap.utils.toArray(".tars-agentic-spawn-clone", agenticSection);
      const label = agenticSection.querySelector(".tars-agentic-spawn-label");
      if (!board || !graph || !clones.length) return;

      gsap.set(board, { transformOrigin: "center center" });
      gsap.set(graph, { transformOrigin: "center center" });
      gsap.set(clones, { opacity: 0, xPercent: 0, x: 0, scale: 0.86, rotateY: -10, filter: "blur(8px)" });
      if (label) gsap.set(label, { opacity: 0, x: -18, filter: "blur(8px)" });

      const renderAgenticFanout = () => {
        const rect = agenticSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        const progress = gsap.utils.clamp(0, 1, (viewportHeight * 0.86 - rect.top) / (viewportHeight * 0.96));
        const eased = gsap.parseEase("power2.out")(progress);
        const drift = Math.round(gsap.utils.interpolate(0, -18, eased));

        gsap.set(header, {
          opacity: gsap.utils.interpolate(1, 0.2, eased),
          y: gsap.utils.interpolate(0, -22, eased),
          filter: `blur(${gsap.utils.interpolate(0, 4, eased)}px)`,
        });
        gsap.set(graph, {
          x: gsap.utils.interpolate(0, -245, eased),
          y: drift,
          scale: gsap.utils.interpolate(1, 0.68, eased),
          rotateY: gsap.utils.interpolate(0, 5, eased),
        });
        if (label) {
          gsap.set(label, {
            opacity: gsap.utils.interpolate(0, 0.92, eased),
            x: gsap.utils.interpolate(-18, 0, eased),
            filter: `blur(${gsap.utils.interpolate(8, 0, eased)}px)`,
          });
        }

        const fanout = [
          { opacity: 0.92, x: 40, y: -34, scale: 0.58, rotateY: -7, blur: 0 },
          { opacity: 0.76, x: 245, y: 28, scale: 0.52, rotateY: -10, blur: 0.8 },
          { opacity: 0.58, x: 420, y: -72, scale: 0.46, rotateY: -13, blur: 1.6 },
        ];

        clones.forEach((clone, index) => {
          const target = fanout[index];
          if (!target) return;
          gsap.set(clone, {
            opacity: gsap.utils.interpolate(0, target.opacity, eased),
            x: gsap.utils.interpolate(0, target.x, eased),
            y: gsap.utils.interpolate(0, target.y + drift, eased),
            scale: gsap.utils.interpolate(0.76, target.scale, eased),
            rotateY: gsap.utils.interpolate(-10, target.rotateY, eased),
            filter: `blur(${gsap.utils.interpolate(8, target.blur, eased)}px)`,
          });
        });
      };

      renderAgenticFanout();
      window.addEventListener("scroll", renderAgenticFanout, { passive: true });
      window.addEventListener("resize", renderAgenticFanout);

      return () => {
        window.removeEventListener("scroll", renderAgenticFanout);
        window.removeEventListener("resize", renderAgenticFanout);
      };
    }, sectionsRef);

    return () => ctx.revert();
  }, [blocks]);

  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="tars-scroll-sections" aria-label="TARS product sections" ref={sectionsRef}>
      <TarsTransitionStorm />
      {blocks.map((block, index) => (
        <section className={`tars-scroll-section tars-scroll-section--${block.tarsBoardSlice || "text"}`} key={`${block.sectionTitle || "section"}-${index}`}>
          <div className="tars-scroll-section__inner">
            {block.sectionTitle && !block.hideSectionTitle ? (
              <div className="tars-scroll-section__copy">
                <h2>{block.sectionTitle}</h2>
              </div>
            ) : null}
            {block.tarsBoardSlice ? (
              <TarsBoardProductSlice kind={block.tarsBoardSlice} />
            ) : null}
          </div>
        </section>
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
              className={`highlights-stack__infoBlock ${
                block.connectionRows ? "highlights-stack__infoBlock--connectionMap" : ""
              }`}
              data-block-index={i}
              data-team-title={block.sectionTitle || "Domain-Specific Agents"}
              data-hide-section-title={block.hideSectionTitle ? "true" : undefined}
              ref={(node) => {
                infoRefsObj.current[i] = node;
              }}
            >
              {block.connectionRows ? (
                <AgentConnectionMap
                  rows={block.connectionRows}
                  prioritizeMedia={prioritizeMedia}
                />
              ) : block.tarsBoardSlice ? (
                <TarsBoardProductSlice kind={block.tarsBoardSlice} />
              ) : block.opsDashboard ? (
                <OpsDashboardPreview dashboard={block.opsDashboard} />
              ) : Array.isArray(block.mediaImages) && block.mediaImages.length ? (
                <div
                  className="highlights-stack__infoMedia highlights-stack__infoMedia--agents"
                  data-agent-count={block.mediaImages.length}
                  aria-hidden="true"
                >
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
              {block.title || block.body ? (
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
              ) : null}
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

  const shouldRenderInfoBlocksAsScroll = !!content.hero.scrollInfoBlocks;
  const productPanelInfoBlocks = shouldRenderInfoBlocksAsScroll ? [] : infoBlocks;

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
        infos.some((info) => info.querySelector(".highlights-stack__infoMedia, .tars-product-slice"));
      const teamMediaScrollLength = `+=${320 + Math.max(0, infos.length - 3) * 72}%`;
      const teamMobileScrollLength = `+=${240 + Math.max(0, infos.length - 3) * 58}%`;

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
      const productTrigger = ScrollTrigger.create({
        id: `${stackId}-product`,
        trigger: productCard,
        start: "top top",
        end: isDesktop
          ? hasTeamMediaSequence ? teamMediaScrollLength : "+=180%"
          : hasTeamInfoSequence ? teamMobileScrollLength : isTeamInlineSequence ? "+=155%" : "+=220%",
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
          panelInfoBlocks={productPanelInfoBlocks}
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

      {shouldRenderInfoBlocksAsScroll ? <TarsScrollSections blocks={infoBlocks} /> : null}

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
