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
        sectionTitle: "Agents",
        tarsBoardSlice: "agents-tab",
        body: "This mirrors the board's actual Agents tab: a single OpenClaw network lane, live handoff lights, trace overlays, and a sanitized Session Tail instead of private logs.",
      },
      {
        sectionTitle: "Vision",
        tarsBoardSlice: "vision",
        body: "On scroll, the agents disappear and the operating principle appears: turn intent into verified execution while preserving privacy, approval gates, and long-term leverage.",
      },
      {
        sectionTitle: "Automations",
        tarsBoardSlice: "automation-cleaner",
        body: "Further down, Vision gives way to the calendar view from the board's Automations tab: sanitized scheduled runs, synthetic cadence, and no sidebar chrome.",
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
