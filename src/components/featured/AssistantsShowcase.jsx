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
import MarketerAgentIcon from "../../../me/agents/marketerlight.png";
import ResearchAgentIcon from "../../../me/agents/researchlight.png";
import SeeMeAgentIcon from "../../../me/agents/seemelight.png";

const tarsAgentCells = [
  { image: CareerAgentIcon, alt: "Career", title: "Career" },
  { image: ClawAgentIcon, alt: "Claw", title: "Claw" },
  { image: DevAgentIcon, alt: "Dev", title: "Dev" },
  { image: NewsAgentIcon, alt: "News", title: "News" },
  { image: PaAgentIcon, alt: "Assistant", title: "Assistant" },
];

const tarsExtendedAgentCells = [
  { image: ResearchAgentIcon, alt: "Research", title: "Research" },
  { image: MarketerAgentIcon, alt: "Marketing", title: "Marketing" },
  { image: SeeMeAgentIcon, alt: "SeeMe", title: "SeeMe" },
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
        mediaImages: tarsAgentCells,
        body: "TARS routes every request to the right specialist, keeping the whole team synchronized around my context, priorities, and active work.",
      },
      {
        mediaImages: tarsExtendedAgentCells,
        body: "When the work shifts, TARS brings in the next specialist layer for research, marketing, and product context without losing the thread.",
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
