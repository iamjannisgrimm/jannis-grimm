import React, { useMemo } from "react";
import ProductStoryStack from "./ProductStoryStack";
import JannisPortrait from "../../../me/JannisGrimm.png";
import TarsPortrait from "../../../me/TARS.png";
import PhoneIcon from "../../../me/phone.png";
import MessagesIcon from "../../../me/messages.png";
import CareerAgentIcon from "../../../me/agents/careerlight.png";
import ClawAgentIcon from "../../../me/agents/clawlight.png";
import DevAgentIcon from "../../../me/agents/devlight.png";
import NewsAgentIcon from "../../../me/agents/newslight.png";
import PaAgentIcon from "../../../me/agents/palight.png";

const tarsAgentCells = [
  { image: CareerAgentIcon, alt: "Career" },
  { image: ClawAgentIcon, alt: "Claw" },
  { image: DevAgentIcon, alt: "Dev" },
  { image: NewsAgentIcon, alt: "News" },
  { image: PaAgentIcon, alt: "PA" },
];

function buildAssistantsContent() {
  return {
    hero: {
      title: "",
      headline: "",
      backgroundColor: "#ffffff",
      themeColor: "#ffffff",
      inlineTitles: ["Meet\nTARS", ""],
      teamIntroDescription:
        "My personal AI — built to orchestrate a team of specialists, hold full context across every conversation, and eliminate the overhead of running my own life.",
      teamCardsDescription:
        "My personal AI — built to orchestrate a team of specialists, hold full context across every conversation, and eliminate the overhead of running my own life.",
      teamCards: {
        left: {
          name: "Jannis",
          image: JannisPortrait,
        },
        right: {
          name: "TARS",
          image: TarsPortrait,
        },
      },
      teamBridgeIcons: {
        left: {
          image: MessagesIcon,
          alt: "Messages",
        },
        right: {
          image: PhoneIcon,
          alt: "Phone",
        },
      },
    },
    infoBlocks: [
      {
        eyebrow: "Invocation",
        title: "Instant Reach",
        mediaImages: tarsAgentCells,
        body: "Reach TARS by phone or message — no app to open, no context to re-establish. Available the moment you need it, exactly where you already are.",
      },
      {
        eyebrow: "Coordination",
        title: "Context Locked",
        mediaImages: tarsAgentCells,
        body: "Every prompt arrives with the right history, priorities, and active threads already loaded — no re-explaining, no lost threads.",
      },
      {
        eyebrow: "Execution",
        title: "Always On",
        mediaImages: tarsAgentCells,
        body: "TARS keeps momentum across conversations, tasks, and follow-ups — the kind of operational continuity a human assistant would take months to build.",
      },
    ],
  };
}

export default function AssistantsShowcase() {
  const content = useMemo(() => buildAssistantsContent(), []);

  return (
    <ProductStoryStack
      content={content}
      stackId="assistants-stack"
      className="highlights-stack--light"
    />
  );
}
