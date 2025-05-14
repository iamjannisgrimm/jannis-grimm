// src/components/chatbot/DesktopChatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

export default function DesktopChatbot({ onFocus, onBlur }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const messagesRef = useRef(null);

  // auto‑scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputFocus = () => {
    setShowStarters(true);
    onFocus?.();
  };

  const handleInputBlur = () => {
    onBlur?.();
  };

  const handleSendMessage = async (text) => {
    setIsLoading(true);
    setMessages((m) => [...m, { sender: "user", text }]);
    try {
      const reply = await getChatbotResponse(`${userContext}\nUser: ${text}`);
      setMessages((m) => [...m, { sender: "bot", text: reply }]);
    } catch {
      setMessages((m) => [...m, { sender: "bot", text: "Error occurred." }]);
    }
    setIsLoading(false);
    setShowStarters(false);
  };

  return (
    <div className="chatbot-container">
      {showStarters && messages.length === 0 ? (
        <div className="starters-container">
          <ConversationStarters onSelectPrompt={handleSendMessage} />
        </div>
      ) : (
        <div ref={messagesRef} className="messages-container">
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