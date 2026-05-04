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
        "A personal AI built around how you think, reflect, and grow.",
      themeColor: "#c4a49a",
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
        body: "Your reflections, habits, and growth — in a space that adapts entirely to how you think.",
      },
      {
        eyebrow: "How it's built",
        title: "Private",
        body: "Nothing shared, nothing sold. SeeMe learns from you without ever using you — your data stays yours, always.",
      },
      {
        eyebrow: "The next layer",
        title: "Growth",
        body: "When you're ready to go deeper, expert coaches step in — turning self-awareness into real, lasting change.",
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
          body: "Hand-selected professionals with proven track records — not a marketplace, but a curated network built for real impact.",
        },
        {
          eyebrow: "How it works",
          title: "Matched",
          body: "SeeMe reads what you're working through and connects you with the right person at exactly the right moment.",
        },
        {
          eyebrow: "The result",
          title: "Progress",
          body: "Not just accountability — a relationship that deepens alongside your journey and shows up exactly when it counts.",
        },
      ],
    },
  };
}

export default function FeaturedProjectsStory() {
  const content = useMemo(() => buildHighlightContent(), []);

  return <ProductStoryStack content={content} stackId="highlights-stack" />;
}
