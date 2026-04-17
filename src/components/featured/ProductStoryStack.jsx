import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FeaturedProjectsStory.css";

gsap.registerPlugin(ScrollTrigger);

function buildCardAnimation(index) {
  let scale = 1;
  let yPercent = 0;
  let autoAlpha = 1;

  if (index === 1) {
    scale = 0.86;
    yPercent = -118;
    autoAlpha = 0.08;
  } else if (index === 2) {
    scale = 0.92;
    yPercent = -72;
    autoAlpha = 0.42;
  } else if (index >= 3) {
    scale = 0.97;
    yPercent = -18;
    autoAlpha = 1;
  }

  return { scale, yPercent, autoAlpha };
}

export default function ProductStoryStack({
  content,
  stackId,
  className = "",
  backgroundStyle,
}) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const rootClassName = useMemo(
    () => ["highlights-stack", className].filter(Boolean).join(" "),
    [className],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || cards.length === 0) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id?.startsWith(`${stackId}-`)) {
          trigger.kill();
        }
      });

      const lastCardIndex = cards.length - 1;
      const lastCardTrigger = ScrollTrigger.create({
        id: `${stackId}-last`,
        trigger: cards[lastCardIndex],
        start: "center center",
      });

      cards.forEach((card, index) => {
        const animationValues = buildCardAnimation(index);
        const timeline = gsap.to(card, {
          ...animationValues,
          ease: "none",
          paused: true,
        });

        ScrollTrigger.create({
          id: `${stackId}-${index}`,
          trigger: card,
          start: "top top",
          end: () => lastCardTrigger.start,
          pin: true,
          pinSpacing: false,
          scrub: 0.35,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: stackId,
          animation: timeline,
          invalidateOnRefresh: true,
        });
      });
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [stackId]);

  return (
    <section className={rootClassName} ref={sectionRef} style={backgroundStyle}>
      <div className="highlights-stack__cards">
        <article
          ref={(node) => {
            cardsRef.current[0] = node;
          }}
          className="highlights-stack__card highlights-stack__card--hero"
          style={{
            backgroundColor: content.hero.backgroundColor || undefined,
          }}
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
              }}
            />
          </div>
        </article>

        <article
          ref={(node) => {
            cardsRef.current[1] = node;
          }}
          className="highlights-stack__card highlights-stack__card--product"
        >
          <div className="highlights-stack__productShell">
            {content.hero.productImage ? (
              <img
                className="highlights-stack__productImage"
                src={content.hero.productImage}
                alt={content.hero.title}
                loading="lazy"
                decoding="async"
              />
            ) : null}

            {content.hero.badge ? (
              <div className="highlights-stack__badgeWrap">
                <img
                  className="highlights-stack__badge"
                  src={content.hero.badge}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </div>
        </article>

        <article
          ref={(node) => {
            cardsRef.current[2] = node;
          }}
          data-page-snap="card"
          data-snap-anchor="center"
          className="highlights-stack__card highlights-stack__card--text"
        >
          <div className="highlights-stack__textPanel">
            <p className="highlights-stack__panelEyebrow">{content.hero.infoEyebrow}</p>
            <h3 className="highlights-stack__panelTitle">{content.hero.title}</h3>
            <p className="highlights-stack__panelHeadline">{content.hero.headline}</p>
            <p className="highlights-stack__panelBody">{content.hero.detail}</p>
            {content.hero.link ? (
              <a
                className="highlights-stack__panelLink"
                href={content.hero.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore more
              </a>
            ) : null}
          </div>
        </article>

        <article
          ref={(node) => {
            cardsRef.current[3] = node;
          }}
          data-page-snap="card"
          data-snap-anchor="center"
          className="highlights-stack__card highlights-stack__card--text highlights-stack__card--secondary"
        >
          <div className="highlights-stack__textPanel">
            <p className="highlights-stack__panelEyebrow">{content.followUp.eyebrow}</p>
            <h3 className="highlights-stack__panelTitle">{content.followUp.title}</h3>
            <p className="highlights-stack__panelHeadline">{content.followUp.headline}</p>
            <p className="highlights-stack__panelBody">{content.followUp.body}</p>
            {content.followUp.link ? (
              <a
                className="highlights-stack__panelLink"
                href={content.followUp.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore more
              </a>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
