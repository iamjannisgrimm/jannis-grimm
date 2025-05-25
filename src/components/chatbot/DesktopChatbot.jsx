import React, { useState, useEffect, useRef } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

export default function DesktopChatbot({ onFocus, onBlur }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [startersVisible, setStartersVisible] = useState(false);
  const messagesRef = useRef(null);

  // Animate starters in after chatbot appears
  useEffect(() => {
    // Delay showing starters to sync with chatbot appearance animation
    const timer = setTimeout(() => {
      if (isFocused && messages.length === 0) {
        setStartersVisible(true);
      }
    }, 300); // Delay to sync with chatbot slide-in
    
    return () => clearTimeout(timer);
  }, [isFocused, messages.length]);

  // scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  
  const handleInputBlur = () => {
    setIsFocused(false);
    setStartersVisible(false);
    onBlur?.();
  };

  const handleSendMessage = async (text) => {
    setIsLoading(true);
    setIsFocused(false);
    setStartersVisible(false);
    setMessages((prev) => [...prev, { sender: "user", text }]);
    try {
      const reply = await getChatbotResponse(`${userContext}\nUser: ${text}`);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container" style={{ position: "relative" }}>
      {isFocused && messages.length === 0 ? (
        <div
          className={`starters-container ${startersVisible ? "entering" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f3f4f6",
            width: "100%",
            padding: "2rem",
            boxSizing: "border-box",
            zIndex: 1,
            opacity: startersVisible ? 1 : 0,
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2
            style={{
              margin: "0 0 3rem",
              fontSize: "4px",
              color: "#111827",
              fontWeight: 700,
              padding: "35px"
            }}
          >
            <h2 className="desktop-starters-title">
            Find out more about Jannis...
            </h2>
          </h2>
          <div className="starters-wrapper">
          <ConversationStarters onSelectPrompt={handleSendMessage} />
          </div>
        </div>
      ) : (
        <div
          ref={messagesRef}
          className="messages-container"
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "400px",
          }}
        >
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
      )}
      <ChatInput
        onSendMessage={handleSendMessage}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </div>
  );
}