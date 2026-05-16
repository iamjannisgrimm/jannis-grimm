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
        "TARS is my personal AI operating system: a phone-accessible control plane that understands my priorities, routes work to the right specialist, and turns ideas into verified action.",
      teamCardsDescription:
        "It is not a chatbot bolted onto my life. It is the interface between my messages, projects, tools, memory, automations, and a team of purpose-built agents.",
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
        sectionTitle: "Domain-Specific Agents",
        mediaImages: tarsAgentCells,
        eyebrow: "Routing layer",
        title: "The right specialist for the job",
        body: "TARS receives the request first, keeps the context intact, and routes it to the specialist that owns the outcome: coding, systems, news, personal ops, career, or product work.",
      },
      {
        hideSectionTitle: true,
        connectionRows: {
          top: tarsAgentCells,
          bottom: tarsExtendedAgentCells,
        },
      },
      {
        sectionTitle: "Reusable Specialists",
        mediaImages: tarsExtendedAgentCells,
        eyebrow: "Reusable layer",
        title: "A toolkit that compounds",
        body: "Research, marketing, and product-context specialists can be reused across projects without starting from zero. They keep their purpose, inherit the right context, and turn repeated work into leverage.",
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
