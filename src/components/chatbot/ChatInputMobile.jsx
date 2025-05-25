import React, { useState, useEffect, useRef } from "react";

function ChatInputMobile({ onSendMessage, onFocus, onBlur }) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const hasFocused = useRef(false);

  // Make sure focus triggers properly
  const handleFocus = (e) => {
    hasFocused.current = true;
    // Ensure proper handling for mobile touch events
    e.stopPropagation(); // Prevent event bubbling
    
    // Focus event should be handled synchronously
    if (onFocus) onFocus(e);
  };

  // Handle blur with improved behavior for mobile
  const handleBlur = (e) => {
    // Prevent immediate blur if another element in the form is clicked
    if (e.relatedTarget && e.relatedTarget.closest('.chat-input-form')) {
      return;
    }
    
    // Ensure we're not in the middle of a touch interaction
    if (onBlur) onBlur(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Focus the input after sending to maintain the keyboard
    onSendMessage(message);
    setMessage("");
    
    // Re-focus the input after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="chat-input-field"
        autoComplete="on"
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
            stroke={message.trim() ? "#14A6FF" : "#BFBFBF"}
            fill={message.trim() ? "#14A6FF" : "#FFFFFF"}
          />
          {/* Up‑pointing arrow */}
          <path
            d="M12 16 L12 8 M8 12 L12 8 L16 12"
            fill="none"
            stroke={message.trim() ? "#fff" : "##BFBFBF"}
            strokeWidth={message.trim() ? "2" : "0.8"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        </button>
    </form>
  );
}

export default ChatInputMobile;