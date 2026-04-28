import React, { useMemo } from "react";
import { getPortfolioTimelineData } from "../../data/portfolio-data";
import ProductStoryStack from "./ProductStoryStack";

const BUCKET = import.meta.env.DEV
  ? "/images"
  : "https://pub-6eb94f6bdfbf410fa3232ad37ef1deab.r2.dev";

function findProject(projects, matcher) {
  return projects.find((project) => matcher(project)) || null;
}

function buildHighlightContent() {
  const projects = getPortfolioTimelineData();

  const heroProject =
    findProject(projects, (project) => project.isHero) ||
    findProject(projects, (project) => project.title === "SeeMe");

  const coachesProject =
    findProject(
      projects,
      (project) => /b2b/i.test(project.title) && /coach/i.test(project.title),
    ) ||
    findProject(projects, (project) => /coach/i.test(project.title));

  return {
    hero: {
      title: heroProject?.title || "SeeMe",
      headline:
        heroProject?.description ||
        "A private, personal AI built around how you think, reflect, and grow.",
      backgroundImage: heroProject?.backgroundImage || heroProject?.image || "",
      productImages: [
        `${BUCKET}/SeeMe/SeeMe1.png`,
        `${BUCKET}/SeeMe/SeeMe2.png`,
        `${BUCKET}/SeeMe/SeeMe3.png`,
        `${BUCKET}/SeeMe/SeeMe4.png`,
        `${BUCKET}/SeeMe/SeeMe5.png`,
      ],
      badge: heroProject?.appStoreBadge || "",
      link: heroProject?.appStoreUrl || heroProject?.website || heroProject?.link || "",
      productUrl: heroProject?.website || heroProject?.link || "https://seemeai.app",
      productUrlLabel: "seemeai.app",
    },
    infoBlocks: [
      {
        eyebrow: "What it is",
        title: "Personal",
        body: "A private, personal AI built around how you think, reflect, and grow — with expert coaches in your corner.",
      },
      {
        eyebrow: "How it feels",
        title: "Private",
        body: "Every reflection stays yours. No data shared, no profiling — just a space that learns how you think and grows with you.",
      },
      {
        eyebrow: "The next layer",
        title: "Growth",
        body: "Expert coaches step in when it matters — turning the product into a system that supports real, lasting growth.",
      },
    ],
    overlay: {
      hero: {
        title: "Coaches",
        headline: "Real experts in your corner, exactly when it matters.",
        backgroundColor: "#0d1117",
        productImages: [
          `${BUCKET}/SeeMe/SeeMeCoach1.png`,
          `${BUCKET}/SeeMe/SeeMeCoach2.png`,
        ],
        badge: coachesProject?.appStoreBadge || heroProject?.appStoreBadge || "",
        link: coachesProject?.appStoreUrl || heroProject?.appStoreUrl || "",
        productUrl: coachesProject?.website || heroProject?.website || "https://seemeai.app",
        productUrlLabel: "seemeai.app",
      },
      infoBlocks: [
        {
          eyebrow: "Who they are",
          title: "Vetted",
          body: "Every coach is carefully selected — professionals who bring real expertise and a track record of guiding meaningful change.",
        },
        {
          eyebrow: "How it works",
          title: "Matched",
          body: "SeeMe surfaces the right coach at the right moment, based on what you're actually working through — not a generic list.",
        },
        {
          eyebrow: "The result",
          title: "Progress",
          body: "Accountability with depth. A system that learns alongside you and brings the human touch exactly where it matters most.",
        },
      ],
    },
  };
}

export default function FeaturedProjectsStory() {
  const content = useMemo(() => buildHighlightContent(), []);

  return <ProductStoryStack content={content} stackId="highlights-stack" />;
}
