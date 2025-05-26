import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import ChatMessages from "./ChatMessages";
import ChatInputMobile from "./ChatInputMobile";
import ConversationStarters from "./ConversationStarters";
import { getChatbotResponse } from "../../services/openaiservice";
import { userContext } from "../../data/prompts";

const MobileChatbot = forwardRef(({ onFocus, onBlur }, ref) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [chatViewVisible, setChatViewVisible] = useState(false);
  const [inputClicked, setInputClicked] = useState(false); // Track when input is specifically clicked
  const chatViewRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isMobile = useRef(window.innerWidth <= 600);
  const latestMessageRef = useRef(null); // Reference to the latest message
  const inputRef = useRef(null); // Reference to the input component
  const initialLoadDone = useRef(false); // Flag to prevent auto-focus on initial load
  const hasMessages = useRef(false); // Track if we have messages to keep chat open
  const barHeight = 58; // height of input bar with padding

  // Expose the handleClose method to parent components
  useImperativeHandle(ref, () => ({
    handleClose: () => handleClose()
  }));

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

  // Set initial load flag
  useEffect(() => {
    initialLoadDone.current = true;
  }, []);

  // Update hasMessages ref when messages change
  useEffect(() => {
    hasMessages.current = messages.length > 0;
  }, [messages]);

  // Auto‑scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      // Use a slight delay to ensure the DOM has updated
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        
        // If there's a latest message ref, scroll to it
        if (latestMessageRef.current) {
          latestMessageRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }, [messages, isLoading]); // Also scroll when loading state changes

  // Show chat view when focused or has messages
  useEffect(() => {
    // Show chat view either when there are messages or when input is clicked
    setChatViewVisible(messages.length > 0 || inputClicked);
    
    // If input was clicked and chat view isn't visible yet, focus the input field
    if (inputClicked && !chatViewVisible && messages.length === 0) {
      setTimeout(() => {
        const inputField = document.querySelector('.chatbot-container .chat-input-field');
        if (inputField) {
          inputField.focus();
        }
      }, 50);
    }
  }, [messages.length, inputClicked, chatViewVisible]);

  const handleInputFocus = (e) => {
    // Only set focus if it was from a real user interaction, not an automatic focus
    if (initialLoadDone.current && e.isTrusted) {
      setIsFocused(true);
      onFocus?.();
      // snap to top once on focus
      window.scrollTo(0, 0);
      setTimeout(() => window.scrollTo(0, 0), 100);
    } else {
      // If it's an automatic focus on load, blur it immediately
      if (inputRef.current && inputRef.current.blur) {
        setTimeout(() => {
          inputRef.current.blur();
        }, 0);
      }
    }
  };

  const handleInputBlur = () => {
    // IMPORTANT: Don't hide the chat view on blur if there are messages
    // This ensures the chat interface stays visible even when keyboard is dismissed
    if (messages.length === 0 && !hasMessages.current) {
      setIsFocused(false);
      // Only hide interface if we're not in the middle of sending a message
      if (!isLoading) {
        setInputClicked(false);
        onBlur?.();
        // Add a small delay to hide the chat view to avoid flickering
        setTimeout(() => {
          setChatViewVisible(false);
        }, 100);
      }
    }
  };

  const handleInputClick = (e) => {
    // Only respond to real user clicks, not simulated ones
    if (e.isTrusted) {
      setInputClicked(true);
      setIsFocused(true);
      onFocus?.();
    }
  };

  const handleSendMessage = async (text) => {
    // Blur the input field to dismiss keyboard, but DON'T exit chat mode
    if (inputRef.current && inputRef.current.blur) {
      inputRef.current.blur();
    }
    
    setIsLoading(true);
    
    // We have messages now, so make sure to keep chat open
    hasMessages.current = true;
    
    setMessages((prev) => [...prev, { sender: "user", text }]);
    
    try {
      const reply = await getChatbotResponse(`${userContext}\nUser: ${text}`);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
      
      // Just reset keyboard height, but KEEP chat view visible
      setTimeout(() => {
        // Make sure to scroll to the bottom of the messages
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handlePromptSelect = (prompt) => {
    // Dismiss keyboard immediately on prompt selection, but keep chat open
    if (inputRef.current && inputRef.current.blur) {
      inputRef.current.blur();
    }
    
    // We have messages now, so make sure to keep chat open
    hasMessages.current = true;
    
    handleSendMessage(prompt);
  };

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
      hasMessages.current = false; // Reset messages tracking
      setIsFocused(false);
      setInputClicked(false);
      setChatViewVisible(false);
      onBlur?.();
    }, 250); // Match the CSS transition duration
  };

  // Function to create a reference for the latest message
  const setLatestMessageRef = (element) => {
    latestMessageRef.current = element;
  };

  return (
    <div className={`chatbot-container ${isFocused || messages.length > 0 ? "focused" : ""}`}>
      {/* Messages View - only shown when there are messages */}
      {chatViewVisible && messages.length > 0 && (
        <div
          ref={chatViewRef}
          className="chat-view-fixed"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#ffffff",
            zIndex: 999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%", /* Ensure 100% height */
            width: "100%", /* Ensure 100% width */
            paddingTop: "env(safe-area-inset-top, 0)", /* Handle safe area insets */
          }}
        >
          {/* Header with gradient background */}
          <div
            className="chat-header-background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "120px", /* Increased from 90px */
              background: "linear-gradient(to bottom, rgba(255,255,255,1) 80%, rgba(255,255,255,0))",
              zIndex: 1500,
              pointerEvents: "none", /* Allow clicks to pass through to elements below */
            }}
          />
          
          {/* Header title */}
          <div 
            style={{
              position: "absolute",
              top: "calc(env(safe-area-inset-top, 20px) + 50px)", /* Match close button position */
              left: "20px",
              zIndex: 1900,
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: "600",
              color: "#333333"
            }}
          >
            Chat
          </div>
          
          {/* Close button positioned absolutely in the top-right corner */}
          <button
            onClick={handleClose}
            aria-label="Close chat"
            style={{
              position: "absolute",
              top: "calc(env(safe-area-inset-top, 20px) + 40px)", /* Moved down significantly */
              right: "15px",
              zIndex: 2000,
              width: "56px", /* Increased from 50px */
              height: "56px", /* Increased from 50px */
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)", /* Increased shadow */
              cursor: "pointer",
              padding: 0,
              transition: "transform 0.2s ease, background-color 0.2s ease" /* Add transition */
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div
            ref={messagesContainerRef}
            className="messages-container"
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              /* Increase top padding to prevent messages from flowing off the top */
              paddingTop: "200px", /* Increased from 170px to accommodate header */
              /* Make sure there's adequate padding on the sides */
              paddingLeft: "16px",
              paddingRight: "16px",
              /* Extra padding at bottom to prevent messages from being hidden under input */
              paddingBottom: `${barHeight + 20}px`,
              width: "100%",
              boxSizing: "border-box",
              scrollBehavior: "smooth",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <ChatMessages 
              messages={messages} 
              isLoading={isLoading} 
              setLatestMessageRef={setLatestMessageRef}
            />
          </div>
        </div>
      )}

      {/* Conversation starters - only shown when input is clicked and no messages yet */}
      {chatViewVisible && messages.length === 0 && inputClicked && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: `${keyboardHeight + barHeight}px`, // Position exactly above the input bar
            zIndex: 1000,
            backgroundColor: "#ffffff",
            width: "100%",
            borderTop: "none"
          }}
        >
          <ConversationStarters mobile onSelectPrompt={handlePromptSelect} />
        </div>
      )}

      {/* Input bar always appears at the bottom, right above the keyboard */}
      <div className="chat-input-fixed"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: `${keyboardHeight}px`, // Always position directly above the keyboard
          width: "100%",
          maxWidth: "100%",
          zIndex: 1001,
          backgroundColor: "#ffffff",
          marginTop: 0,
          paddingTop: 0, 
          paddingBottom: 6,
          borderTop: "none",
          transition: "opacity 0.25s ease, bottom 0.3s ease", // Smooth transition when keyboard appears
          boxShadow: "none"
        }}
      >
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <ChatInputMobile
            ref={inputRef}
            onSendMessage={handleSendMessage}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onClick={handleInputClick}
            preventAutoFocus={true} // Prevent auto-focusing on mount
          />
        </div>
      </div>
    </div>
  );
});

export default MobileChatbot;