// src/components/chatbot/Chatbot.jsx
import React, { useState, useEffect } from "react";
import DesktopChatbot from "./DesktopChatbot";
import MobileChatbot from "./MobileChatbot";

export default function Chatbot(props) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileChatbot {...props} /> : <DesktopChatbot {...props} />;
}