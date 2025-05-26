import React, { useState, useEffect, useRef, forwardRef } from "react";

const ChatInputMobile = forwardRef(({ onSendMessage, onFocus, onBlur, onClick, preventAutoFocus = false }, ref) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const hasFocused = useRef(false);
  const messageWasSent = useRef(false);

  // Focus input automatically when mounted, but only if not prevented
  useEffect(() => {
    if (inputRef.current && !hasFocused.current && !preventAutoFocus) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          hasFocused.current = true;
        }
      }, 300);
    }
  }, [preventAutoFocus]);

  // Make sure focus triggers properly
  const handleFocus = (e) => {
    hasFocused.current = true;
    // Ensure proper handling for mobile touch events
    e.stopPropagation(); // Prevent event bubbling
    
    // Focus event should be handled synchronously
    if (onFocus) onFocus(e);
    
    // Force scroll to visible area to ensure input is visible above keyboard
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  // Handle blur with improved behavior for mobile
  const handleBlur = (e) => {
    // Don't trigger onBlur if we just sent a message (to keep chat open)
    if (messageWasSent.current) {
      messageWasSent.current = false;
      return;
    }
    
    // Prevent immediate blur if another element in the form is clicked
    if (e.relatedTarget && e.relatedTarget.closest('.chat-input-form')) {
      return;
    }
    
    // Ensure we're not in the middle of a touch interaction
    if (onBlur) onBlur(e);
  };

  const handleClick = (e) => {
    // Handle click event to open chat interface
    if (onClick) onClick(e);
    
    // Make sure to focus the input when clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Mark that we just sent a message (to prevent chat closing on blur)
    messageWasSent.current = true;
    
    // Send message and clear input
    onSendMessage(message);
    setMessage("");
    
    // Immediately blur the input to dismiss keyboard
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };
  
  // Expose input methods to parent component
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    blur: () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }));

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
        onClick={handleClick}
        className="chat-input-field"
        autoComplete="off" /* Prevent autocomplete from disrupting layout */
        autoFocus={false} /* Explicitly disable autoFocus attribute */
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className={`chat-input-submit ${message.trim() ? "active" : ""}`}
        onMouseDown={(e) => {
          // Prevent the button click from blurring the input
          e.preventDefault();
        }}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
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
});

export default ChatInputMobile;