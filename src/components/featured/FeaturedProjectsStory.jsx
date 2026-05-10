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
      headline: <>A <strong>private, personal</strong> AI built around how you think and grow — with expert coaches in your corner.</>,
      themeColor: "#c4a49a",
      backgroundImage: heroProject?.backgroundImage || heroProject?.image || "",
      productImages: [
        `${BUCKET}/SeeMe/SeeMe1.png`,
        `${BUCKET}/SeeMe/SeeMe2.png`,
        `${BUCKET}/SeeMe/SeeMe3.png`,
        `${BUCKET}/SeeMe/SeeMe4.png`,
        `${BUCKET}/SeeMe/SeeMe5.png`,
      ],
      mobileCarouselStartIndex: 1,
      badge: heroProject?.appStoreBadge || "",
      link: heroProject?.appStoreUrl || heroProject?.website || heroProject?.link || "",
      productUrl: heroProject?.website || heroProject?.link || "https://seemeai.app",
      productUrlLabel: "seemeai.app",
    },
    infoBlocks: [
      {
        eyebrow: "What it is",
        title: "Personal",
        body: "Your coaches draw from your calendar, health, habits, journal, focus areas, and more — every signal from your life, woven into context that makes the coaching actually personal.",
      },
      {
        eyebrow: "How it's built",
        title: "Private",
        body: "On-device by default. Your data stays on your phone — that's not a policy, it's the architecture. Cloud mode is optional, and even then, nothing is stored.",
      },
      {
        eyebrow: "How it works",
        title: "Structured",
        body: "Morning check-ins, weekly reviews, Wheel of Life assessments — professional coaching frameworks available anytime, not just open-ended chat.",
      },
    ],
    overlay: {
      hero: {
        title: "For Coaches",
        headline: "Build your digital coaching presence — available to every client, every day, without you in the room.",
        backgroundColor: "#0d1117",
        productImages: [
          `${BUCKET}/SeeMe/SeeMeCoach1.png`,
          `${BUCKET}/SeeMe/SeeMeCoach2.png`,
        ],
        ctaLabel: "Request Access",
        ctaHref:
          coachesProject?.website ||
          heroProject?.website ||
          heroProject?.appStoreUrl ||
          "https://seemeai.app",
        ctaAriaLabel: "Request access to SeeMe Coaches",
        productUrl: coachesProject?.website || heroProject?.website || "https://seemeai.app",
        productUrlLabel: "seemeai.app",
      },
      infoBlocks: [
        {
          eyebrow: "Your digital clone",
          title: "Upload You",
          body: "Upload your methodology, frameworks, and communication style. Your AI runs your approach — fully private, fully yours. Client data never leaves their device. Your IP stays yours.",
        },
        {
          eyebrow: "Beyond live sessions",
          title: "New Tools",
          body: "Create reusable session programs that go beyond what a live call can do — daily check-ins, adaptive exercises, pattern recognition across all your clients, and progress that compounds automatically.",
        },
        {
          eyebrow: "Grow your practice",
          title: <><span style={{fontWeight: 400}}>Up to </span><strong>10x Clients</strong></>,
          body: "Assign sessions between calls, keep every client engaged and on track, and reclaim calendar time — so you can serve up to 10x more people without working more hours.",
        },
      ],
    },
  };
}

export default function FeaturedProjectsStory() {
  const content = useMemo(() => buildHighlightContent(), []);

  return <ProductStoryStack content={content} stackId="highlights-stack" />;
}
