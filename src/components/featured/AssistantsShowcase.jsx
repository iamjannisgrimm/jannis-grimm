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
        "TARS is the AI operating system I built around my life and work: a phone-accessible orchestrator that understands priorities, keeps memory, and turns intent into verified execution.",
      teamCardsDescription:
        "It is not one chatbot pretending to do everything. It is a command layer between my messages, tools, projects, memory, automations, and a team of purpose-built agents.",
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
        sectionTitle: "Orchestrator",
        mediaImages: tarsAgentCells,
        body: "Every request lands with TARS first. It decides what matters, preserves the context, and routes the work to the execution surface that should actually own the outcome.",
      },
      {
        sectionTitle: "Specialist Team",
        connectionRows: {
          top: tarsAgentCells,
          bottom: tarsExtendedAgentCells,
        },
        body: "Developer, research, marketing, personal ops, systems, and product agents are not feature badges. They are focused work surfaces that inherit direction, execute their slice, and report back cleanly.",
      },
      {
        sectionTitle: "Command Center",
        body: "The Kanban Board is the proof layer: a private operating room where ideas become scoped cards, approved cards become agent runs, and completed work leaves artifacts, verification, and leverage behind.",
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
