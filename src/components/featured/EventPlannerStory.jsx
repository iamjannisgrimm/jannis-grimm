import React, { useMemo } from "react";
import ProductStoryStack from "./ProductStoryStack";

const BUCKET = import.meta.env.DEV
  ? "/images"
  : "https://pub-6eb94f6bdfbf410fa3232ad37ef1deab.r2.dev";

function buildPlannerContent() {
  return {
    hero: {
      title: "Venty",
      headline: "Meet your personal event planner. Tell it what you want — it coordinates everyone and everything to make it happen.",
      backgroundImage: `${BUCKET}/weddingbg.png`,
      backgroundColor: "#2f4257",
      themeColor: "#2f4257",
      productImages: [
        `${BUCKET}/Venty/Venty1.png?v=2`,
        `${BUCKET}/Venty/Venty3.png?v=2`,
      ],
    },
    infoBlocks: [
      {
        eyebrow: "How it starts",
        title: "Just Talk",
        body: "Describe your event in plain language. Venty understands what you need, builds the plan, and gets to work — no forms, no setup, no back-and-forth.",
      },
      {
        eyebrow: "What it handles",
        title: "Everything",
        body: "Status checks, reminders, vendor follow-ups, guest questions, updates — Venty runs the entire coordination layer so you never have to chase anyone.",
      },
      {
        eyebrow: "The result",
        title: "Effortless",
        body: "Walk into your event knowing every detail was handled. Venty coordinated it all while you stayed focused on the things that actually matter.",
      },
    ],
    overlay: {
      hero: {
        title: "For your Invitees",
        headline: "Every guest gets their own beautiful event page — with everything they need from save the date to the big day.",
        backgroundColor: "#F6F2ED",
        productImages: [
          `${BUCKET}/Venty/Venty4.png?v=2`,
          `${BUCKET}/Venty/Venty5.png?v=2`,
          `${BUCKET}/Venty/Venty6.png?v=2`,
        ],
      },
      infoBlocks: [
        {
          eyebrow: "Their event page",
          title: "Personal",
          body: "A photo-first event page with all the details, schedule, and RSVP — everything your guests need, beautifully presented in one place.",
        },
        {
          eyebrow: "Gift registry",
          title: "Flexible",
          body: "A built-in registry where guests can buy whole gifts or chip in together — no third-party site, no redirects, no friction.",
        },
        {
          eyebrow: "Travel & resources",
          title: "Guided",
          body: "Curated travel guides, rental cars, restaurants, and local tips — Venty puts your guests in the know before they even arrive.",
        },
      ],
    },
  };
}

export default function EventPlannerStory() {
  const content = useMemo(() => buildPlannerContent(), []);

  return (
    <ProductStoryStack
      content={content}
      stackId="event-planner-stack"
      className="highlights-stack--planner"
    />
  );
}
