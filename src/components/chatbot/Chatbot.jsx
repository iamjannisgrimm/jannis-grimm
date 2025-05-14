import React, { useState, useEffect, useRef } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

export default function Chatbot({ onFocus, onBlur }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const chatViewRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isMobile = useRef(window.innerWidth <= 600);

  // Constants
  const BAR_HEIGHT = 64; // height of the chat input bar
  // Reduce the gap by adding a negative offset
  const GAP_OFFSET = -60; // This will make the chat view slightly overlap with the input

  // Track on-screen keyboard via visualViewport
  useEffect(() => {
    if (!window.visualViewport) return;
    
    const vv = window.visualViewport;
    
    const update = () => {
      // Calculate keyboard height
      const kh = window.innerHeight - vv.height;
      setKeyboardHeight(kh > 0 ? kh : 0);
      
      // Force the chat view to be visible at the top of the screen
      window.scrollTo(0, 0);
    };
    
    // Check for window resize to update mobile status
    const handleResize = () => {
      isMobile.current = window.innerWidth <= 600;
      update();
    };
    
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("resize", handleResize);
    
    // Initial update
    update();
    handleResize();
    
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Effect to scroll messages to bottom when new ones arrive
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputFocus = () => {
    setIsFocused(true);
    onFocus?.();
    
    // Ensure the viewport is at the top
    window.scrollTo(0, 0);
    
    // Double-check after a short delay to ensure proper positioning
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

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

  const handlePromptSelect = (prompt) => handleSendMessage(prompt);

  // Show the fixed chat view whenever focused or we already have messages
  const showChatView = isFocused || messages.length > 0;

  return (
    <div className={`chatbot-container ${isFocused ? "focused" : ""}`}>
      {showChatView && (
        <div
          ref={chatViewRef}
          className="chat-view-fixed"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            // Add the GAP_OFFSET to reduce the gap
            bottom: `${keyboardHeight + BAR_HEIGHT + GAP_OFFSET}px`,
            backgroundColor: "#ffffff",
            zIndex: 999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {messages.length === 0 ? (
            <div
              className="starters-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                paddingBottom: "0", // No padding at the bottom
                height: "100%",
                overflow: "auto"
              }}
            >
              <ConversationStarters onSelectPrompt={handlePromptSelect} />
            </div>
          ) : (
            <div 
              ref={messagesContainerRef}
              className="messages-container" 
              style={{ 
                flex: 1, 
                overflowY: "auto", 
                padding: "1rem",
                paddingBottom: "0", // Remove bottom padding
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end"
              }}
            >
              <div className="messages-wrapper">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </div>
            </div>
          )}
        </div>
      )}
      
      <div
        className="chat-input-fixed"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: `${keyboardHeight}px`,
          width: "100%",
          maxWidth: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          marginTop: 0,
          paddingTop: 0
        }}
      >
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <ChatInput
            onSendMessage={handleSendMessage}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
      </div>
    </div>
  );
}