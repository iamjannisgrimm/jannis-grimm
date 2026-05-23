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
        body: "This mirrors the board's actual Agents tab: one OpenClaw network lane, a real-looking demo query, live handoff lights, and a sanitized Session Tail instead of private logs.",
      },
      {
        sectionTitle: "Command Center",
        tarsBoardSlice: "command-center",
        body: "On scroll, the same operating system resolves into Sprint: ideas become scoped cards, ready work becomes execution, and every completed slice leaves artifacts and verification behind.",
      },
      {
        sectionTitle: "Automations",
        tarsBoardSlice: "automation-cleaner",
        body: "After the command center comes the maintenance layer: scheduled workflows, cleanup runs, bridge health, and runtime hygiene surfaced as calm, operator-readable cards.",
      },
      {
        sectionTitle: "Privacy & Architecture",
        tarsBoardSlice: "architecture",
        body: "The architecture is intentionally boring where it should be: local bridges, scoped agents, credential references, approval gates, and portfolio demos that never expose private cards, logs, tokens, or live personal data.",
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
