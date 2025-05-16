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
  const messagesRef = useRef(null);

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
    onBlur?.();
  };

  const handleSendMessage = async (text) => {
    setIsLoading(true);
    setIsFocused(false);
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
          className="starters-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f3f4f6",      // light gray so white buttons pop
            width: "100%",
            padding: "2rem",
            boxSizing: "border-box",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              margin: "0 0 3rem",     // ↑ increased bottom margin to 3rem
              fontSize: "4px",
              color: "#111827",
              fontWeight: 700,
              padding: "50px"
            }}
          >
            <h2 className="desktop-starters-title">
            Find out more about me...
            </h2>
          </h2>
          <ConversationStarters onSelectPrompt={handleSendMessage} />
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