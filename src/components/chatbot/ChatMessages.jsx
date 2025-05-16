import React from "react";
import ReactMarkdown from "react-markdown";

export default function ChatMessages({ messages, isLoading }) {
  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 200px)",    // use remaining viewport
        overflowY: "auto",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",      // anchor to bottom
      }}
    >
      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .message-animate {
            animation: slideUpFade 0.5s ease forwards;
          }

          @keyframes blinkDots {
            0%,100% { opacity: 0.2; }
            50%     { opacity: 1; }
          }
          .typing-dots span {
            display: inline-block;
            font-size: 24px;
            animation: blinkDots 1s infinite;
          }
          .typing-dots span:nth-child(1) { animation-delay: 0s; }
          .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
          .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        `}
      </style>

      {messages.map((msg, idx) => {
        const isUser = msg.sender === "user";
        return (
          <div
            key={idx}
            className="message-animate"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                maxWidth: isUser ? "80%" : "100%",
                padding: "10px 16px",
                borderRadius: "12px",
                background: isUser ? "#85A7D5" : "#F5F5F5",
                color: isUser ? "#ffffff" : "#111827",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                textAlign: isUser ? "right" : "left",
                wordWrap: "break-word",
              }}
            >
              {isUser
                ? msg.text
                : <ReactMarkdown>{msg.text}</ReactMarkdown>
              }
            </span>
          </div>
        );
      })}

      {isLoading && (
        <div
          className="message-animate"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 16px",
              borderRadius: "12px",
              background: "#F5F5F5",
              color: "#111827",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <span className="typing-dots">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </span>
          </span>
        </div>
      )}
    </div>
  );
}