import React, { useMemo } from "react";
import ProductStoryStack from "./ProductStoryStack";
import JannisPortrait from "../../../me/JannisGrimm.png";
import TarsPortrait from "../../../me/TARS.png";
import PhoneIcon from "../../../me/phone.png";
import MessagesIcon from "../../../me/messages.png";

function buildAssistantsContent() {
  return {
    hero: {
      title: "",
      headline: "",
      backgroundColor: "#10161f",
      themeColor: "#10161f",
      scrollInfoBlocks: false,
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
        sectionTitle: "Agents",
        tarsBoardSlice: "agents-tab",
      },
      {
        sectionTitle: "Manage",
        tarsBoardSlice: "vision",
      },
      {
        sectionTitle: "Automations",
        tarsBoardSlice: "automation-cleaner",
      },
      {
        sectionTitle: "Architecture & Privacy",
        tarsBoardSlice: "architecture-privacy",
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
      className="highlights-stack--light highlights-stack--tars"
    />
  );
}
