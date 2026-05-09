import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FeaturedProjectsStory.css";

gsap.registerPlugin(ScrollTrigger);

function setThemeColor(color) {
  const meta = document.querySelector("meta[name='theme-color']");
  if (meta) meta.setAttribute("content", color);
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
}) {
  const headerH = header ? header.offsetHeight + 16 : 0;
  const hasCompanion = !!companion;
  const useStackedDesktopInfo = isDesktop && !hasCompanion;
  const introHold = hasCompanion ? 0.18 : 0.2;
  const hasInlineTitles = inlineTitles.length > 0;

  if (hasInlineTitles) {
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

      if (isMobileTeamScene) {
        tl.to([teamIntro.leftSlot, teamIntro.bridge], {
          opacity: 0,
          y: -18,
          duration: 0.16,
          ease: "power1.inOut",
        }, 0.98);
        tl.to(teamIntro.rightCard, {
          y: -320,
          duration: 0.32,
          ease: "power2.inOut",
        }, 1.0);
      } else {
        tl.to([teamIntro.leftCard, teamIntro.bridge], {
          opacity: 0,
          x: -220,
          duration: 0.22,
          ease: "power1.inOut",
        }, 0.98);
        tl.to(teamIntro.rightCard, {
          x: desktopCardShiftX - 140,
          duration: 0.32,
          ease: "power2.inOut",
        }, 1.0);
      }

      if (teamIntro.infoWindow) {
        tl.to(teamIntro.infoWindow, {
          opacity: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
        }, 1.16);
      }

      if (infos[0]) {
        tl.to(infos[0], {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
        }, 1.2);
        if (infos[1] || infos[2]) {
          tl.to(infos[0], {
            opacity: 0,
            y: -20,
            duration: 0.14,
            ease: "power1.inOut",
          }, 1.42);
        }
      }

      if (infos[1]) {
        tl.to(infos[1], {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
        }, 1.48);
        if (infos[2]) {
          tl.to(infos[1], {
            opacity: 0,
            y: -20,
            duration: 0.14,
            ease: "power1.inOut",
          }, 1.7);
        }
      }

      if (infos[2]) {
        tl.to(infos[2], {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
        }, 1.76);
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

  if (infos[0]) gsap.set(infos[0], { opacity: 0, x: useStackedDesktopInfo ? 0 : -travel, y: useStackedDesktopInfo ? 34 : 12 });
  if (infos[1]) {
    gsap.set(infos[1], { opacity: 0, x: 0, y: useStackedDesktopInfo ? 42 : 56 });
  }
  if (infos[2]) gsap.set(infos[2], { opacity: 0, x: useStackedDesktopInfo ? 0 : travel, y: useStackedDesktopInfo ? 50 : 12 });
  if (companion) gsap.set(companion, { opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  // Phase 1: title out + image up
  if (header) tl.to(header, { y: -22, opacity: 0, duration: 0.14, ease: "power1.in" }, introHold);
  if (image && headerH > 0) tl.to(image, { y: -headerH, duration: 0.18, ease: "power2.inOut" }, introHold);
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
      tl.to(infos[0], { x: -Math.round(travel * 0.6), y: -8, opacity: 0, duration: 0.11, ease: "power1.in" }, 0.7);
    }
    if (infos[1]) {
      tl.to(infos[1], { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.78);
      tl.to(infos[1], { y: -36, opacity: 0, duration: 0.11, ease: "power1.in" }, 0.88);
    }
    if (infos[2]) {
      tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.94);
    }
  } else {
    if (useStackedDesktopInfo) {
      if (infos[0]) {
        tl.to(infos[0], { x: 0, y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.42);
        tl.to(infos[0], { x: 0, y: -24, opacity: 0, duration: 0.16, ease: "power1.inOut" }, 0.58);
      }
      if (infos[1]) {
        tl.to(infos[1], { x: 0, y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.68);
        tl.to(infos[1], { x: 0, y: -24, opacity: 0, duration: 0.16, ease: "power1.inOut" }, 0.84);
      }
      if (infos[2]) {
        tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.92);
      }
    } else {
      // Original info block positions (no companion — unchanged)
      if (infos[0]) {
        tl.to(infos[0], { x: 0, y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0.42);
        tl.to(infos[0], { x: -Math.round(travel * 0.6), y: -8, opacity: 0, duration: 0.12, ease: "power1.in" }, 0.58);
      }
      if (infos[1]) {
        tl.to(infos[1], { y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0.68);
        tl.to(infos[1], { y: -36, opacity: 0, duration: 0.12, ease: "power1.in" }, 0.84);
      }
      if (infos[2]) {
        tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0.92);
      }
    }
  }

  return tl;
}

function makeSnapConfig(hasCompanion = false) {
  const stops = hasCompanion
    ? [0, 0.58, 0.78, 0.94, 1.0]
    : [0, 0.42, 0.68, 0.92, 1.0];
  return {
    snapTo: (value) => stops.reduce((a, b) =>
      Math.abs(b - value) < Math.abs(a - value) ? b : a
    ),
    duration: { min: 0.08, max: 0.16 },
    delay: 0,
    inertia: false,
    ease: "power3.out",
  };
}

function makeInlineTitleSnapConfig(count, isTeamInlineSequence = false) {
  const baseStops = isTeamInlineSequence
    ? [0, 0.18, 0.58, 1]
    : [0, 0.18, 0.5, 0.82, 1];
  const stops = baseStops.slice(0, Math.max(3, count + 2));
  return {
    snapTo: (value) => stops.reduce((a, b) =>
      Math.abs(b - value) < Math.abs(a - value) ? b : a
    ),
    duration: { min: 0.08, max: 0.16 },
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
                  <p className="highlights-stack__teamIntroDescription">
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

      // ── Product panel ──────────────────────────────────────────────────────
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
              infoWindow: productTeamInfoWindowRef.current,
              }
            : null,
        isDesktop,
        travel,
      });

      const productTrigger = ScrollTrigger.create({
        id: `${stackId}-product`,
        trigger: productCard,
        start: "top top",
        end: isDesktop ? "+=180%" : hasTeamInfoSequence ? "+=240%" : isTeamInlineSequence ? "+=155%" : "+=220%",
        pin: true,
        pinSpacing: true,
        scrub: isDesktop ? 0.08 : 0.04,
        fastScrollEnd: isDesktop,
        preventOverlaps: stackId,
        animation: tl,
        invalidateOnRefresh: true,
        snap: isDesktop
          ? (productInlineTitles.length
              ? makeInlineTitleSnapConfig(productInlineTitles.length)
              : makeSnapConfig(!!productCompanion))
          : false,
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
        });
        overlayTrigger = ScrollTrigger.create({
          id: `${stackId}-overlay`,
          trigger: overlayCard,
          start: "top top",
          end: isDesktop ? "+=180%" : "+=220%",
          pin: true,
          pinSpacing: true,
          scrub: isDesktop ? 0.06 : 0.04,
          fastScrollEnd: isDesktop,
          preventOverlaps: stackId,
          animation: contentTl,
          invalidateOnRefresh: true,
          snap: isDesktop ? makeSnapConfig(!!overlayCompanion) : false,
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
      ctx.revert();
    };
  }, [stackId]);

  return (
    <section className={rootClassName} ref={sectionRef} style={backgroundStyle}>
      {/* Static hero backdrop */}
      <article
        ref={heroCardRef}
        className="highlights-stack__card highlights-stack__card--hero"
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
