import React, { useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

function Chatbot({ onFocus, onBlur }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Send a user message and fetch a bot response
  const handleSendMessage = async (text) => {
    setIsLoading(true);
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

  // Starter prompt click
  const handlePromptSelect = (prompt) => {
    handleSendMessage(prompt);
  };

  // When input gains focus
  const handleInputFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  // When input loses focus (or background clicked)
  const handleInputBlur = () => {
    setIsFocused(false);
    onBlur?.();
    setMessages([]);  // clear all messages when exiting
  };

  return (
    <div className="chatbot-container">
      {/* Landing: show starters only when focused and no messages */}
      {isFocused && messages.length === 0 ? (
        <div className="starters-container enter">
          <ConversationStarters onSelectPrompt={handlePromptSelect} />
        </div>
      ) : (
        <ChatMessages messages={messages} isLoading={isLoading} />
      )}

      <ChatInput
        onSendMessage={handleSendMessage}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </div>
  );
}

export default Chatbot;