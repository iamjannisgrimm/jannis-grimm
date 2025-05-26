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
  const [isInputClicked, setIsInputClicked] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  // Expose the handleClose method to parent components
  useImperativeHandle(ref, () => ({
    handleClose: () => handleClose()
  }));

  // Animate starters in after chatbot appears
  useEffect(() => {
    // Delay showing starters to sync with chatbot appearance animation
    const timer = setTimeout(() => {
      if (isFocused && messages.length === 0 && isInputClicked) {
        setStartersVisible(true);
      }
    }, 300); // Delay to sync with chatbot slide-in
    
    return () => clearTimeout(timer);
  }, [isFocused, messages.length, isInputClicked]);

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
    // Only blur and hide starters if there are no messages
    if (messages.length === 0) {
      setIsFocused(false);
      setStartersVisible(false);
      onBlur?.();
    }
  };

  const handleInputClick = () => {
    setIsInputClicked(true);
    setIsFocused(true);
    onFocus?.();
  };

  const handleSendMessage = async (text) => {
    setIsLoading(true);
    setIsInputClicked(true);
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
      setIsInputClicked(false);
      onBlur?.();
    }, 250); // Match the CSS transition duration
  };

  const shouldShowChat = (isFocused && isInputClicked) || messages.length > 0;

  return (
    <div className="chatbot-container" style={{ 
      position: "relative",
      width: "100%",
      maxWidth: "750px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {shouldShowChat && (
        <button 
          onClick={handleClose}
          className="chat-close-button"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 100,
            background: "none",
            border: "none",
            padding: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            backgroundColor: "#f1f1f1",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#e5e5e5";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#f1f1f1";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {isFocused && isInputClicked && messages.length === 0 ? (
        <div
          className={`starters-container ${startersVisible ? "entering" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#ffffff",
            width: "100%",
            padding: "1.5rem",
            boxSizing: "border-box",
            zIndex: 1,
            opacity: startersVisible ? 1 : 0,
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            position: "relative",
            marginBottom: "16px"
          }}
        >
          <div className="starters-wrapper" style={{ 
            width: "100%", 
            position: "relative",
            paddingTop: "10px",
            display: "flex",
            justifyContent: "center" 
          }}>
            <ConversationStarters onSelectPrompt={handleSendMessage} />
          </div>
        </div>
      ) : shouldShowChat ? (
        <div
          ref={messagesRef}
          className="messages-container"
          style={{
            width: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "420px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            backgroundColor: "#ffffff",
            padding: "16px",
            marginBottom: "16px",
            position: "relative"
          }}
        >
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
      ) : null}
      <div style={{ width: "100%", maxWidth: "650px" }}>
        <ChatInput
          ref={inputRef}
          onSendMessage={handleSendMessage}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
        />
      </div>
    </div>
  );
});

export default DesktopChatbot;