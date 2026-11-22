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
      scrollInfoBlocks: true,
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
        sectionTitle: "",
        tarsBoardSlice: "agents-tab",
      },
      {
        sectionTitle: "Vision",
        hideSectionTitle: true,
        tarsBoardSlice: "vision",
      },
      {
        sectionTitle: "Automation",
        hideSectionTitle: true,
        tarsBoardSlice: "automation-cleaner",
      },
      {
        sectionTitle: "Security",
        hideSectionTitle: true,
        tarsBoardSlice: "security",
      },
      {
        sectionTitle: "Early Access",
        tarsBoardSlice: "early-access",
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
