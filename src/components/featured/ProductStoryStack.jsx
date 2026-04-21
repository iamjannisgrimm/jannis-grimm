import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FeaturedProjectsStory.css";

gsap.registerPlugin(ScrollTrigger);

function buildPanelTimeline({ header, image, companion, badge, url, infos, isDesktop, travel }) {
  const headerH = header ? header.offsetHeight + 16 : 0;
  const hasCompanion = !!companion;

  if (infos[0]) gsap.set(infos[0], { opacity: 0, x: -travel, y: 12 });
  if (infos[1]) {
    gsap.set(infos[1], { opacity: 0, x: 0, y: 56 });
    if (isDesktop) gsap.set(infos[1], { xPercent: -50 });
  }
  if (infos[2]) gsap.set(infos[2], { opacity: 0, x: travel, y: 12 });
  if (companion) gsap.set(companion, { opacity: 0 });

  const tl = gsap.timeline({ paused: true });

  // Phase 1: title out + image up
  if (header) tl.to(header, { y: -22, opacity: 0, duration: 0.14, ease: "power1.in" }, 0);
  if (image && headerH > 0) tl.to(image, { y: -headerH, duration: 0.18, ease: "power2.inOut" }, 0);
  const extras = [badge, url].filter(Boolean);
  if (extras.length) tl.to(extras, { opacity: 0, duration: 0.12, ease: "power1.in" }, 0);

  if (hasCompanion) {
    // Phase 2: companion fades in, both images pan left together
    const slideX = image && image.offsetWidth
      ? -Math.round(image.offsetWidth * 0.50)
      : -Math.round(window.innerWidth * 0.22);
    tl.to(companion, { opacity: 1, duration: 0.22, ease: "power2.out" }, 0.20);
    tl.to(image, { x: slideX, duration: 0.26, ease: "power2.inOut" }, 0.20);

    // Phase 3–5: info blocks (shifted to make room for companion phase)
    if (infos[0]) {
      tl.to(infos[0], { x: 0, y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.48);
      tl.to(infos[0], { x: -Math.round(travel * 0.6), y: -8, opacity: 0, duration: 0.11, ease: "power1.in" }, 0.62);
    }
    if (infos[1]) {
      tl.to(infos[1], { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.69);
      tl.to(infos[1], { y: -36, opacity: 0, duration: 0.11, ease: "power1.in" }, 0.81);
    }
    if (infos[2]) {
      tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.87);
    }
  } else {
    // Original info block positions (no companion — unchanged)
    if (infos[0]) {
      tl.to(infos[0], { x: 0, y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0.10);
      tl.to(infos[0], { x: -Math.round(travel * 0.6), y: -8, opacity: 0, duration: 0.12, ease: "power1.in" }, 0.42);
    }
    if (infos[1]) {
      tl.to(infos[1], { y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0.50);
      tl.to(infos[1], { y: -36, opacity: 0, duration: 0.12, ease: "power1.in" }, 0.70);
    }
    if (infos[2]) {
      tl.to(infos[2], { x: 0, y: 0, opacity: 1, duration: 0.16, ease: "power2.out" }, 0.78);
    }
  }

  return tl;
}

function makeSnapConfig(hasCompanion = false) {
  return {
    snapTo: (value) => {
      if (value < 0.22) return value;
      const stops = hasCompanion ? [0.42, 0.64, 0.83, 1.0] : [0.32, 0.64, 1.0];
      return stops.reduce((a, b) =>
        Math.abs(b - value) < Math.abs(a - value) ? b : a,
      );
    },
    duration: { min: 0.25, max: 0.45 },
    delay: 0.45,
    ease: "power2.inOut",
  };
}

function MobileCarousel({ images, title }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    let clearPrev;
    const tick = setInterval(() => {
      setCur((c) => {
        const next = (c + 1) % images.length;
        setPrev(c);
        clearPrev = setTimeout(() => setPrev(null), 450);
        return next;
      });
    }, 3000);
    return () => {
      clearInterval(tick);
      clearTimeout(clearPrev);
    };
  }, [images.length]);

  return (
    <div className="highlights-stack__carouselTrack">
      {prev !== null ? (
        <img
          key={`out-${prev}`}
          className="highlights-stack__carouselImg highlights-stack__carouselImg--out"
          src={images[prev]}
          alt={`${title} ${prev + 1}`}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <img
        key={`in-${cur}`}
        className={`highlights-stack__carouselImg${prev !== null ? " highlights-stack__carouselImg--in" : ""}`}
        src={images[cur]}
        alt={`${title} ${cur + 1}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function PanelShell({ panelContent, panelInfoBlocks, headerRef, imageRef, companionImageRef, badgeRef, urlRef, infoRefsObj }) {
  const { hero } = panelContent;
  const hasCompanion = !!hero.companionImage;

  return (
    <div className="highlights-stack__productShell">
      <div className="highlights-stack__productHeader" ref={headerRef}>
        <h2 className="highlights-stack__productTitle">{hero.title}</h2>
        <p className="highlights-stack__productSubtitle">{hero.headline}</p>
      </div>

      <div className="highlights-stack__productImageGroup">
        {Array.isArray(hero.productImages) && hero.productImages.length ? (
          <div ref={imageRef} className="highlights-stack__productImagesOuter">
            {/* Desktop: all images side by side */}
            <div className="highlights-stack__productImages highlights-stack__productImages--desktop">
              {hero.productImages.map((src, i) => (
                <img
                  key={i}
                  className="highlights-stack__productImageItem"
                  src={src}
                  alt={`${hero.title} ${i + 1}`}
                  loading="lazy"
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
            {/* Mobile: auto-advancing carousel */}
            <MobileCarousel images={hero.productImages} title={hero.title} />
          </div>
        ) : hero.productImage && hasCompanion ? (
          <div ref={imageRef} className="highlights-stack__productImages highlights-stack__productImages--pair">
            <img
              className="highlights-stack__productImageItem"
              src={hero.productImage}
              alt={hero.title}
              loading="lazy"
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
        ) : hero.productImage ? (
          <img
            ref={imageRef}
            className="highlights-stack__productImage"
            src={hero.productImage}
            alt={hero.title}
            loading="lazy"
            decoding="async"
          />
        ) : null}

        {hero.badge ? (
          <a
            ref={badgeRef}
            className="highlights-stack__badgeWrap"
            href={hero.link || hero.productUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
          >
            <img
              className="highlights-stack__badge"
              src={hero.badge}
              alt="Download on the App Store"
              loading="lazy"
              decoding="async"
            />
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

      {panelInfoBlocks.length > 0 ? (
        <div className="highlights-stack__infoWindow">
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
  const sectionRef = useRef(null);
  const heroCardRef = useRef(null);
  const productCardRef = useRef(null);
  const productHeaderRef = useRef(null);
  const productImageRef = useRef(null);
  const productCompanionImageRef = useRef(null);
  const productBadgeRef = useRef(null);
  const productUrlRef = useRef(null);
  const infoRefs = useRef([]);

  const overlayCardRef = useRef(null);
  const overlayHeaderRef = useRef(null);
  const overlayImageRef = useRef(null);
  const overlayCompanionImageRef = useRef(null);
  const overlayBadgeRef = useRef(null);
  const overlayUrlRef = useRef(null);
  const overlayInfoRefs = useRef([]);

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

    const overlayCard = overlayCardRef.current;
    const overlayHeader = overlayHeaderRef.current;
    const overlayImage = overlayImageRef.current;
    const overlayCompanion = overlayCompanionImageRef.current;
    const overlayBadge = overlayBadgeRef.current;
    const overlayUrl = overlayUrlRef.current;
    const oInfos = overlayInfoRefs.current.filter(Boolean);

    if (!section || !heroCard || !productCard) return undefined;

    const ctx = gsap.context(() => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.id?.startsWith(`${stackId}-`)) t.kill();
      });

      const isDesktop = window.innerWidth > 768;
      const travel = isDesktop ? Math.round(window.innerWidth * 0.55) : 120;

      // ── Product panel ──────────────────────────────────────────────────────
      const tl = buildPanelTimeline({
        header: productHeader,
        image: productImage,
        companion: productCompanion,
        badge: productBadge,
        url: productUrl,
        infos,
        isDesktop,
        travel,
      });

      const productTrigger = ScrollTrigger.create({
        id: `${stackId}-product`,
        trigger: productCard,
        start: "top top",
        end: "+=280%",
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        anticipatePin: 1,
        animation: tl,
        invalidateOnRefresh: true,
        snap: makeSnapConfig(!!productCompanion),
      });

      // ── Overlay panel ──────────────────────────────────────────────────────
      let overlayTrigger = null;

      if (overlayCard) {
        ScrollTrigger.create({
          id: `${stackId}-overlay-entry`,
          trigger: overlayCard,
          start: "top bottom",
          end: "top top",
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value) => (value > 0.35 ? 1 : 0),
            duration: { min: 0.12, max: 0.28 },
            delay: 0.05,
            ease: "power2.out",
          },
        });

        if (oInfos.length) {
          const overlayTl = buildPanelTimeline({
            header: overlayHeader,
            image: overlayImage,
            companion: overlayCompanion,
            badge: overlayBadge,
            url: overlayUrl,
            infos: oInfos,
            isDesktop,
            travel,
          });

          overlayTrigger = ScrollTrigger.create({
            id: `${stackId}-overlay`,
            trigger: overlayCard,
            start: "top top",
            end: "+=280%",
            pin: true,
            pinSpacing: true,
            scrub: 0.3,
            anticipatePin: 1,
            animation: overlayTl,
            invalidateOnRefresh: true,
            snap: makeSnapConfig(!!overlayCompanion),
          });
        }
      }

      // ── Hero backdrop pin — stays through both panels ───────────────────────
      ScrollTrigger.create({
        id: `${stackId}-hero`,
        trigger: heroCard,
        start: "top top",
        end: () => (overlayTrigger ? overlayTrigger.end : productTrigger.end),
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
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
          data-page-snap="card"
          data-snap-anchor="top"
          data-snap-base-offset="0"
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
        data-page-snap="card"
        data-snap-anchor="top"
        data-snap-base-offset="0"
        className="highlights-stack__card highlights-stack__card--product"
      >
        <PanelShell
          panelContent={content}
          panelInfoBlocks={infoBlocks}
          headerRef={productHeaderRef}
          imageRef={productImageRef}
          companionImageRef={productCompanionImageRef}
          badgeRef={productBadgeRef}
          urlRef={productUrlRef}
          infoRefsObj={infoRefs}
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
          />
        </article>
      ) : null}
    </section>
  );
}
