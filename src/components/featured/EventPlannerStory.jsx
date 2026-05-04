import React, { useMemo } from "react";
import ProductStoryStack from "./ProductStoryStack";

const BUCKET = import.meta.env.DEV
  ? "/images"
  : "https://pub-6eb94f6bdfbf410fa3232ad37ef1deab.r2.dev";

function buildPlannerContent() {
  return {
    hero: {
      title: "Venty",
      headline: "An AI event planner that feels calm, premium, and deeply useful from the very first screen.",
      backgroundImage: `${BUCKET}/weddingbg.png`,
      backgroundColor: "#2f4257",
      themeColor: "#2f4257",
      productImages: [
        `${BUCKET}/Venty/Venty1.png?v=2`,
        `${BUCKET}/Venty/Venty3.png?v=2`,
      ],
    },
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
          body: "Venues, vendors, timing, guest lists — the assistant tracks every moving part so nothing slips through the cracks.",
        },
        {
          eyebrow: "How it feels",
          title: "Guided",
          body: "Not a form, not a checklist. A conversation that unfolds naturally — turning vague ideas into a concrete, coordinated plan.",
        },
        {
          eyebrow: "The outcome",
          title: "Confident",
          body: "From first idea to fully planned event, every step feels considered — backed by intelligence that anticipates what comes next.",
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
