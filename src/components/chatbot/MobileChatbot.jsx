import React, { useState, useEffect, useRef } from "react";
import ChatMessages from "./ChatMessages";
import ChatInputMobile from "./ChatInputMobile";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

export default function MobileChatbot({ onFocus, onBlur }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [chatViewVisible, setChatViewVisible] = useState(false);
  const chatViewRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isMobile = useRef(window.innerWidth <= 600);

  // Constants
  const BAR_HEIGHT = 64;   // height of the chat input bar
  const GAP_OFFSET = -60;  // overlap tweak

  // Track on‑screen keyboard via visualViewport (resize only)
  useEffect(() => {
    if (!window.visualViewport) return;
    const vv = window.visualViewport;

    const update = () => {
      const kh = window.innerHeight - vv.height;
      setKeyboardHeight(kh > 0 ? kh : 0);
    };

    const handleResize = () => {
      isMobile.current = window.innerWidth <= 600;
      update();
    };

    vv.addEventListener("resize", update);
    window.addEventListener("resize", handleResize);

    update();
    handleResize();

    return () => {
      vv.removeEventListener("resize", update);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto‑scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Show chat view when focused or has messages
  useEffect(() => {
    // This ensures consistent behavior between first tap and subsequent taps
    setChatViewVisible(isFocused || messages.length > 0);
    
    // When chat view becomes visible and there are no messages,
    // ensure we focus the input to bring up the keyboard
    if ((isFocused || messages.length > 0) && !chatViewVisible) {
      // Use a slight delay to ensure DOM is ready
      setTimeout(() => {
        // Find the input field and focus it
        const inputField = document.querySelector('.chatbot-container .chat-input-field');
        if (inputField) {
          inputField.focus();
        }
      }, 50);
    }
  }, [isFocused, messages.length, chatViewVisible]);

  const handleInputFocus = () => {
    setIsFocused(true);
    onFocus?.();
    // snap to top once on focus
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    onBlur?.();
    // Don't hide the chat view on blur if there are messages
    if (messages.length === 0) {
      // Add a small delay to hide the chat view to avoid flickering
      setTimeout(() => {
        setChatViewVisible(false);
      }, 100);
    }
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

  // Function to clear messages and close the chat interface
  const handleClose = () => {
    // First add the exiting class to messages for fade-out animation
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.classList.add('exiting');
    }
    
    // Add exiting class to the chat view container as well
    if (chatViewRef.current) {
      chatViewRef.current.classList.add('exiting');
    }
    
    // After a short delay, clear messages and close the interface
    setTimeout(() => {
      setMessages([]);
      setIsFocused(false);
      setChatViewVisible(false);
      onBlur?.();
    }, 250); // Match the CSS transition duration
  };

  return (
    <div className={`chatbot-container ${isFocused ? "focused" : ""}`}>
      {chatViewVisible && (
        <div
          ref={chatViewRef}
          className="chat-view-fixed"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            /* ensure we clear the notch area on iOS */
            paddingTop: "env(safe-area-inset-top)",
            /* original bottom offset */
            bottom: `${keyboardHeight + BAR_HEIGHT + GAP_OFFSET}px`,
            backgroundColor: "#ffffff",
            zIndex: 999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "opacity 0.25s ease"
          }}
        >
          {messages.length > 0 && (
            <button
              onClick={handleClose}
              className="chat-close-button-mobile"
              style={{
                position: "absolute",
                top: "env(safe-area-inset-top, 10px)",
                right: "10px",
                zIndex: 1001,
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
          
          {messages.length === 0 ? (
            <div
              className="starters-container enter"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                /* pad a bit all around so title & tile are fully visible */
                padding: "1rem",
                paddingBottom: "2rem", // extra room above the input
                paddingLeft: "1.25rem", // ensure first tile isn't flush to edge
                paddingRight: "1.25rem",
                boxSizing: "border-box",
              }}
            >
              <ConversationStarters mobile onSelectPrompt={handlePromptSelect} />
            </div>
          ) : (
            <div
              ref={messagesContainerRef}
              className="messages-container"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                paddingBottom: "0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <ChatMessages messages={messages} isLoading={isLoading} />
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
          paddingTop: 0,
          opacity: messages.length > 0 ? 1 : 1, // Always visible, but we can animate this later if needed
          transition: "opacity 0.25s ease"
        }}
      >
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <ChatInputMobile
            onSendMessage={handleSendMessage}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
      </div>
    </div>
  );
}