import React, { useState } from "react";

function ChatInput({ onSendMessage, onFocus, onBlur }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        onFocus={onFocus}
        onBlur={onBlur}
        className="chat-input-field"
        autoComplete="off"
      />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`chat-input-submit ${message.trim() ? "active" : ""}`}
          onMouseDown={(e) => {
            // Prevent the button click from blurring the input
            e.preventDefault();
          }}
          onClick={handleSubmit}
        >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke={message.trim() ? "#2563eb" : "#9ca3af"}
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