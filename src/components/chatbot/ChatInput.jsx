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
    width="29"
    height="29"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Filled circle background */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={message.trim() ? "#14A6FF" : "##BFBFBF"}
      fill={message.trim() ? "#14A6FF" : "#EFEFEF"}
    />
    {/* Up‑pointing arrow */}
    <path
      d="M12 16 L12 8 M8 12 L12 8 L16 12"
      fill="none"
      stroke={message.trim() ? "#fff" : "##BFBFBF"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

        </button>
    </form>
  );
}

export default ChatInput;