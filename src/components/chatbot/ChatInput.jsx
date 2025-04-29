import React, { useState } from "react";

function ChatInput({ onSendMessage, isAnchored }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`chat-input-form ${isAnchored ? "anchored" : ""}`}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        className={`chat-input-field ${isAnchored ? "anchored" : ""}`}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className={`chat-input-submit ${message.trim() ? "active" : ""}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16V8" />
          <path d="M8 11L12 8L16 11" />
        </svg>
      </button>
    </form>
  );
}

export default ChatInput;