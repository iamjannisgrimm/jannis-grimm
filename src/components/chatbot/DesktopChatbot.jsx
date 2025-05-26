import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

const DesktopChatbot = forwardRef(({ onFocus, onBlur }, ref) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [startersVisible, setStartersVisible] = useState(false);
  const messagesRef = useRef(null);

  // Expose the handleClose method to parent components
  useImperativeHandle(ref, () => ({
    handleClose: () => handleClose()
  }));

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

  // Function to clear messages and retract the chat interface
  const handleClose = () => {
    // First add the exiting class to messages for fade-out animation
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.classList.add('exiting');
    }
    
    // After a short delay, clear messages and retract
    setTimeout(() => {
      setMessages([]);
      setIsFocused(false);
      setStartersVisible(false);
      onBlur?.();
    }, 250); // Match the CSS transition duration
  };

  return (
    <div className="chatbot-container" style={{ position: "relative" }}>
      {messages.length > 0 && (
        <button 
          onClick={handleClose}
          className="chat-close-button"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
            background: "none",
            border: "none",
            padding: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            backgroundColor: "#f1f1f1",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

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
});

export default DesktopChatbot;