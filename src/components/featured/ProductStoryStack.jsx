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
    if (teamIntro?.cards) {
      gsap.set(teamIntro.cards, { "--team-title-opacity": 0 });
    }

    if (infos[0]) gsap.set(infos[0], { opacity: 0, y: 28 });
    if (infos[1]) gsap.set(infos[1], { opacity: 0, y: 36 });
    if (infos[2]) gsap.set(infos[2], { opacity: 0, y: 44 });
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
            if (root) gsap.set(root, { opacity: 0, y: 0 });
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
          y: -320,
          duration: 0.32,
          ease: "power2.inOut",
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
        tl.to(teamIntro.rightCard, {
          x: hasTeamMediaSequence ? desktopCardCenterX : desktopCardShiftX - 140,
          y: 0,
          scale: hasTeamMediaSequence ? 0.86 : 1,
          duration: 0.38,
          ease: "power3.inOut",
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
          const isConnectionMap = root?.classList.contains("highlights-stack__infoBlock--connectionMap");
          const isFinalInfoItem = index === teamInfoItems.length - 1;
          const mediaExitStart = content && !isConnectionMap ? textStart : exitStart;
          const contentStart = isConnectionMap ? imageStart + 0.22 : textStart + 0.03;

          if (index === 1 && teamIntro.rightCard) {
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
    count: 3,
    cards: [
      { epic: "TARS", title: "Shape a safe portfolio product slice", summary: "Inspect the real board surface, preserve private data boundaries, and turn the idea into an execution card.", priority: "medium", assignee: "TARS" },
      { epic: "Personal", title: "Morning refinement packet", summary: "Convert rough ideas into approved, scoped work without asking for mechanical input.", priority: "low", assignee: "TARS" },
    ],
  },
  {
    title: "ready",
    count: 2,
    cards: [
      { epic: "SeeMe", title: "Coach onboarding proof artifact", summary: "Definition of done, deliverables, approval boundary, and execution log are ready for an agent handoff.", priority: "high", assignee: "TARS" },
      { epic: "TARS", title: "Verify runtime bridge health", summary: "Local checks only; no secrets, tokens, or private logs leave the machine.", priority: "medium", assignee: "Developer" },
    ],
  },
  {
    title: "doing",
    count: 1,
    cards: [
      { epic: "TARS", title: "Browser QA and build verification", summary: "Run the project, inspect the rendered slice, and commit only the scoped diff.", priority: "high", assignee: "Developer", live: true },
    ],
  },
];

const tarsAgents = [
  { id: "tars", name: "TARS", headline: "Entrypoint", role: "Routes intent, context, and approvals", tier: "tars", tone: "110, 110, 115", live: true },
  { id: "seeme", name: "SeeMe", headline: "Domain owner", role: "Product, app, launch, coach growth", tier: "domain", tone: "255, 77, 112" },
  { id: "personal", name: "Personal", headline: "Domain owner", role: "Calendar, finance, wedding, life ops", tier: "domain", tone: "0, 113, 227" },
  { id: "career", name: "Career", headline: "Domain owner", role: "Applications, positioning, leverage", tier: "domain", tone: "255, 214, 10" },
  { id: "claw", name: "Claw", headline: "Domain owner", role: "OpenClaw control plane", tier: "domain", tone: "255, 149, 0" },
  { id: "developer", name: "Developer", headline: "Specialist", role: "Code, debug, refactor, verify", tier: "specialist", tone: "63, 70, 80", live: true },
  { id: "marketer", name: "Marketer", headline: "Specialist", role: "Narrative, launch, customer voice", tier: "specialist", tone: "255, 45, 85" },
  { id: "research", name: "Research", headline: "Specialist", role: "Evidence, sources, synthesis", tier: "specialist", tone: "175, 82, 222" },
  { id: "news", name: "News", headline: "Specialist", role: "Market signal retrieval", tier: "specialist", tone: "90, 200, 250" },
  { id: "legal", name: "Legal", headline: "Specialist", role: "Risk triage and policies", tier: "specialist", tone: "88, 86, 214" },
  { id: "security", name: "Security", headline: "Specialist", role: "Secrets and auth review", tier: "specialist", tone: "255, 179, 64" },
];

const tarsRawEvents = [
  { time: "09:41:08", type: "Request", agent: "TARS", action: "request received", status: "Started" },
  { time: "09:41:12", type: "Reasoning", agent: "TARS", action: "handoff: TARS → Developer", status: "Started" },
  { time: "09:41:24", type: "Tool", agent: "Developer", action: "using tool: browser QA", status: "Started" },
  { time: "09:42:03", type: "Document", agent: "Frontend", action: "reading context: ProductStoryStack.jsx", status: "Completed" },
  { time: "09:42:38", type: "Response", agent: "Developer", action: "final response sent", status: "Completed" },
];

const tarsAutomationDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const tarsAutomationHours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const tarsAutomationEvents = [
  { title: "Morning refinement", day: 0, start: 7, duration: 1.35, recurrence: "Weekdays", lane: "main" },
  { title: "Inbox triage", day: 0, start: 9.5, duration: 0.75, recurrence: "Daily", lane: "main" },
  { title: "SeeMe nightly execution", day: 0, start: 23, duration: 1.2, recurrence: "Daily", lane: "dw" },
  { title: "Personal ops run", day: 1, start: 3, duration: 1.0, recurrence: "Daily", lane: "private" },
  { title: "TARS cleanup", day: 1, start: 5, duration: 0.9, recurrence: "Daily", lane: "main" },
  { title: "Bridge health check", day: 2, start: 12, duration: 0.5, recurrence: "Every 30m", lane: "main" },
  { title: "Memory review", day: 3, start: 16, duration: 1.5, recurrence: "Weekly", lane: "private" },
  { title: "Weekend planning", day: 5, start: 10, duration: 1.25, recurrence: "Weekly", lane: "dw" },
];

function BoardCard({ card }) {
  return (
    <article className={`tars-board-card${card.live ? " is-live" : ""}`}>
      <span className="tars-board-epic">{card.epic}</span>
      <h4>{card.title}</h4>
      <p>{card.summary}</p>
      <div className="tars-board-card-meta">
        <span className={`tars-priority-${card.priority}`}>{card.priority}</span>
        <span>{card.assignee}</span>
      </div>
    </article>
  );
}

function TarsAgentNode({ agent }) {
  return (
    <article
      className={`tars-agent-tab-node tars-agent-tab-node--${agent.tier}${agent.live ? " is-live-active" : ""}`}
      style={{ "--agent-rgb": agent.tone }}
    >
      <span className="tars-agent-tab-kicker">{agent.headline}</span>
      <span className="tars-agent-tab-orb"><b>{agent.name.slice(0, 2).toUpperCase()}</b></span>
      <strong>{agent.name}</strong>
      {agent.live ? <em><i />Live</em> : null}
      <small>{agent.role}</small>
    </article>
  );
}

function TarsAgentsTabSlice() {
  const domainAgents = tarsAgents.filter((agent) => agent.tier === "domain");
  const specialistAgents = tarsAgents.filter((agent) => agent.tier === "specialist");
  const tars = tarsAgents.find((agent) => agent.tier === "tars");

  return (
    <div className="tars-product-slice tars-product-slice--agents-tab" aria-hidden="true">
      <section className="tars-agents-tab-main">
        <header className="tars-agents-tab-header">
          <div><h3>Agents</h3></div>
          <div className="tars-agent-lane-segmented"><span className="is-current">MAIN<i /></span><span>DW</span><span>AUTO</span><span>Active only</span></div>
        </header>
        <div className="tars-agent-lane-board">
          <div className="tars-agent-invocation-panel"><strong>Ship the portfolio TARS section</strong><small>Synthetic request · /new and /compact controls hidden</small></div>
          <div className="tars-agent-trace-panel"><section><h4>Current</h4><p>Developer</p><small>Browser QA running</small></section><section><h4>Trace</h4><p>handoff → verify</p><small>sanitized</small></section></div>
          <div className="tars-agent-network">
            <svg className="tars-agent-connectors" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
              <path d="M500 88 C500 132 500 146 500 172" />
              <path d="M500 172 C190 172 150 214 150 258" />
              <path d="M500 172 C380 172 360 214 360 258" />
              <path d="M500 172 C620 172 640 214 640 258" />
              <path d="M500 172 C810 172 850 214 850 258" />
              <path className="is-live-active" d="M500 92 C500 330 130 350 130 426" />
              <path d="M150 332 C150 386 300 392 300 426" />
              <path d="M360 332 C360 392 470 392 470 426" />
              <path d="M640 332 C640 392 640 392 640 426" />
              <path d="M850 332 C850 386 810 392 810 426" />
            </svg>
            <div className="tars-agent-tier tars-agent-tier--top">{tars ? <TarsAgentNode agent={tars} /> : null}</div>
            <div className="tars-agent-tier-label">Domain owners</div>
            <div className="tars-agent-row tars-agent-row--domains">{domainAgents.map((agent) => <TarsAgentNode agent={agent} key={agent.id} />)}</div>
            <div className="tars-agent-tier-label">Reusable specialists</div>
            <div className="tars-agent-row tars-agent-row--specialists">{specialistAgents.map((agent) => <TarsAgentNode agent={agent} key={agent.id} />)}</div>
          </div>
          <ol className="tars-agent-raw-list tars-agent-raw-list--tab">
            {tarsRawEvents.map((event) => (
              <li key={`${event.time}-${event.action}`} className={event.status === "Started" ? "is-active" : "is-terminal"}>
                <time>{event.time}</time><span><b>{event.action}</b><small>{event.agent} · {event.type} · {event.status}</small></span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

function TarsVisionSlice() {
  return (
    <div className="tars-product-slice tars-product-slice--vision" aria-hidden="true">
      <div className="tars-vision-topbar"><h3>Vision</h3><div><span className="is-active">North star</span><span>Operating rule</span></div></div>
      <div className="tars-why-markdown">
        <h3>Every run compounds toward operator freedom.</h3>
        <p>TARS turns vague intent into scoped cards, routes the work to the right agent, verifies output, and leaves an artifact trail that can be resumed later.</p>
        <blockquote>Bias toward action, privacy boundaries intact, no raw secrets in UI, and no public action without approval.</blockquote>
      </div>
      <div className="tars-epic-list">
        {["SeeMe leverage", "Personal peace", "Runtime reliability"].map((title, index) => (
          <article className="tars-epic-row" key={title}><i style={{ background: ["#ff4d70", "#0071e3", "#ff9500"][index] }} /><strong>{title}</strong><span>Synthetic operating lane</span><b>ready</b></article>
        ))}
      </div>
    </div>
  );
}

function TarsAutomationCalendarSlice() {
  return (
    <div className="tars-product-slice tars-product-slice--automation-calendar" aria-hidden="true">
      <section className="automation-calendar-shell" aria-label="Weekly automation schedule">
        <div className="automation-calendar-header">
          <div className="automation-calendar-header-spacer" />
          {tarsAutomationDays.map((day, index) => <div className="automation-calendar-day-head" key={day} style={{ gridColumn: index + 2 }}><strong>{day}</strong></div>)}
        </div>
        <div className="automation-calendar-body" role="list">
          <div className="automation-calendar-time-rail"><div className="automation-calendar-time-track">{tarsAutomationHours.map((hour) => <span key={hour} style={{ "--time-top": `${(hour / 24) * 100}%` }}>{String(hour).padStart(2, "0")}:00</span>)}</div></div>
          {tarsAutomationDays.map((day, index) => (
            <div className="automation-calendar-day" key={day} style={{ gridColumn: index + 2 }}>
              <div className="automation-calendar-day-track">
                {index === 1 ? <div className="automation-calendar-current-time" style={{ "--automation-now-top": "54%" }} data-current-time-label="12:58" /> : null}
                {tarsAutomationEvents.filter((event) => event.day === index).map((event) => (
                  <article className={`automation-calendar-block automation-instance-${event.lane}${event.duration < 0.75 ? " automation-calendar-block-compact" : event.duration >= 1.25 ? " automation-calendar-block-roomy" : ""}`} key={event.title} style={{ "--automation-top": `${(event.start / 24) * 100}%`, "--automation-duration-hours": event.duration }}>
                    <div className="automation-calendar-block-visible"><h3>{event.title}</h3><div className="automation-calendar-meta"><span>{event.recurrence}</span></div></div>
                  </article>
                ))}
              </div>
            </div>
          ))}
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
          <div className="tars-product-brand"><span>J</span><strong>Jannis</strong><small>CEO</small></div>
          {[["◆", "Vision"], ["▦", "Sprint", true], ["⌁", "Backlog"], ["⌘", "Agents"], ["◎", "Automations"]].map(([icon, label, active]) => (
            <span className={`tars-product-tab${active ? " is-active" : ""}`} key={label}><i>{icon}</i>{label}</span>
          ))}
        </aside>
        <section className="tars-product-main">
          <header className="tars-product-section-header"><h3>Sprint</h3><button>+</button></header>
          <div className="tars-board-columns">
            {tarsBoardColumns.map((column) => (
              <section className="tars-board-column" key={column.title}>
                <header><strong>{column.title}</strong><span>{column.count}</span></header>
                <div>{column.cards.map((card) => <BoardCard card={card} key={card.title} />)}</div>
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
