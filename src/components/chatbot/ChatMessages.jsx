import React from "react";
import ReactMarkdown from "react-markdown";

function ChatMessages({ messages, isLoading }) {
  return (
    <div
      style={{
        height: "calc(100vh - 200px)", // Use remaining viewport height
        overflowY: "auto",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end", // Align messages to the bottom
      }}
    >
      {/* Define keyframe animations */}
      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .message-animate {
            animation: slideUpFade 0.5s ease forwards;
          }
          @keyframes blinkDots {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
          .typing-dots span {
            display: inline-block;
            animation: blinkDots 1s infinite;
          }
          .typing-dots span:nth-child(1) { animation-delay: 0s; }
          .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
          .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        `}
      </style>

      {messages.map((msg, index) => (
        <div
          key={index}
          className="message-animate"
          style={{
            display: "flex",
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "10px 16px",
              marginRight: msg.sender === "user" ? "40px" : "0",
              borderRadius: "12px",
              background: msg.sender === "user" ? "#85A7D5" : "#F5F5F5",
              color: msg.sender === "user" ? "#ffffff" : "#111827",
              maxWidth: "80%",
              wordWrap: "break-word",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown> // Render markdown for bot responses
            ) : (
              msg.text
            )}
          </span>
        </div>
      ))}

      {isLoading && (
        <div
          className="message-animate"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "12px",
              background: "#f3f4f6",
              color: "#111827",
              maxWidth: "80%",
              wordWrap: "break-word",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Thinking
            <span className="typing-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessages;