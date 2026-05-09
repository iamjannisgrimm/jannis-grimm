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
      inlineTitles: ["Meet\nTARS", "Meet My\nAssistants"],
      teamIntroDescription:
        "The ultimate personal assistant ready to orchestrate my whole team of specialists automating my life.",
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
        body: "Call on TARS in the moment you need it, without switching contexts or breaking flow.",
      },
      {
        eyebrow: "Coordination",
        title: "Context Locked",
        body: "Every prompt arrives with the right history, priorities, and active threads already in view.",
      },
      {
        eyebrow: "Execution",
        title: "Always On",
        body: "TARS keeps momentum across conversations, tasks, and follow-ups so nothing drops off the map.",
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
