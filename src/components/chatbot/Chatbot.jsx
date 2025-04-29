import React, { useState, useEffect, useRef } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnchored, setIsAnchored] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const chatRef = useRef(null);
  const [initialPosition, setInitialPosition] = useState(null);

  // Store initial chat position & track resize
  useEffect(() => {
    if (chatRef.current) {
      const { top, left } = chatRef.current.getBoundingClientRect();
      setInitialPosition({ top, left });
    }
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Blur content when anchored
  useEffect(() => {
    const blurrable = document.querySelector(".blurrable-content");
    if (blurrable) {
      blurrable.style.filter = isAnchored ? "blur(50px)" : "none";
      blurrable.style.transition = "filter 1.5s cubic-bezier(0.4,0,0.2,1)";
    }
  }, [isAnchored]);

  // Overlay click to exit
  useEffect(() => {
    let overlay = document.getElementById("click-exit-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "click-exit-overlay";
      document.body.appendChild(overlay);
    }
    Object.assign(overlay.style, {
      position: "fixed",
      inset: 0,
      background: "transparent",
      opacity: isAnchored ? "1" : "0",
      pointerEvents: isAnchored ? "auto" : "none",
      transition: "opacity 1.5s cubic-bezier(0.4,0,0.2,1)",
      zIndex: 900,
      cursor: "pointer",
    });
    const onClick = () => setIsAnchored(false);
    overlay.addEventListener("click", onClick);
    return () => {
      overlay.removeEventListener("click", onClick);
      if (!isAnchored) overlay.remove();
    };
  }, [isAnchored]);

  // Send & receive messages
  const handleSendMessage = async (text) => { /*...*/ };
  const handlePromptSelect = (p) => handleSendMessage(p);
  const handleInputClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsAnchored(true), 300);
  };

  // Compute transform so the chat moves down when anchored
  const getTransform = () => {
    if (!isAnchored || !initialPosition) return "none";
    const moveY = window.innerHeight - 104 - initialPosition.top;
    return `translateY(${moveY}px)`;
  };

  // Responsive input width
  const inputBarWidth = Math.min(screenWidth * 0.9, 500);

  return (
    <div className="chatbot-container">
      <div
        ref={chatRef}
        className={`chatbot-wrapper ${isAnchored ? "anchored" : ""}`}
        style={{
          position: isAnchored ? "fixed" : "relative",
          transform: getTransform(),
          zIndex: isAnchored ? 1000 : 1,
        }}
      >
        {isAnchored && (
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <ConversationStarters onSelectPrompt={handlePromptSelect} />
            ) : (
              <ChatMessages messages={messages} isLoading={isLoading} />
            )}
          </div>
        )}

        <div
          className={`chatbot-input-trigger ${isAnchored ? "anchored" : ""}`}
          onClick={handleInputClick}
          style={{ cursor: isAnchored ? "default" : "pointer" }}
        >
          <div
            className="chatbot-input-wrapper"
            style={{ width: `${inputBarWidth}px` }}
          >
            <ChatInput onSendMessage={handleSendMessage} isAnchored={isAnchored} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;