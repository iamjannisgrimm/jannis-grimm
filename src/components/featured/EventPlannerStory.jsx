import React, { useMemo } from "react";
import ProductStoryStack from "./ProductStoryStack";

const BUCKET = import.meta.env.DEV
  ? "/images"
  : "https://pub-6eb94f6bdfbf410fa3232ad37ef1deab.r2.dev";

function buildPlannerContent() {
  return {
    hero: {
      title: "Venty",
      headline: "An AI planner that makes complex events feel effortless — from first idea to the big day.",
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
        eyebrow: "What it solves",
        title: "Complexity",
        body: "Venues, guests, vendors, timelines — Venty holds every detail together so the planning never overwhelms the vision.",
      },
      {
        eyebrow: "How it feels",
        title: "Calm",
        body: "No spreadsheets, no chasing replies. Every task, reminder, and coordination in one focused, beautiful space.",
      },
      {
        eyebrow: "The result",
        title: "Confidence",
        body: "Walk into your event knowing every detail is right — because Venty made sure nothing was ever left to chance.",
      },
    ],
    overlay: {
      hero: {
        title: "Assistant",
        headline: "The coordinator behind the scenes — so you can stay in the moment.",
        backgroundColor: "#F6F2ED",
        productImages: [
          `${BUCKET}/Venty/Venty4.png?v=2`,
          `${BUCKET}/Venty/Venty5.png?v=2`,
          `${BUCKET}/Venty/Venty6.png?v=2`,
        ],
      },
      infoBlocks: [
        {
          eyebrow: "What it handles",
          title: "Logistics",
          body: "Venues, vendors, timing, guests — every moving part tracked and coordinated so nothing slips through the cracks.",
        },
        {
          eyebrow: "How it works",
          title: "Guided",
          body: "Not a form or a checklist — a conversation that unfolds naturally and turns vague ideas into a fully coordinated plan.",
        },
        {
          eyebrow: "The outcome",
          title: "Confident",
          body: "From first conversation to the big day — every step feels considered, backed by intelligence that anticipates what's next.",
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
