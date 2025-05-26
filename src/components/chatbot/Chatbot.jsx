// src/components/chatbot/Chatbot.jsx
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import DesktopChatbot from "./DesktopChatbot";
import MobileChatbot from "./MobileChatbot";

const Chatbot = forwardRef((props, ref) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  useImperativeHandle(ref, () => ({
    handleClose: () => {
      if (isMobile && mobileRef.current) {
        // Call the mobile chatbot's handleClose method
        mobileRef.current.handleClose();
      } else if (!isMobile && desktopRef.current) {
        // Call the desktop chatbot's handleClose method
        desktopRef.current.handleClose();
      }
    }
  }));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? 
    <MobileChatbot {...props} ref={mobileRef} /> : 
    <DesktopChatbot {...props} ref={desktopRef} />;
});

export default Chatbot;