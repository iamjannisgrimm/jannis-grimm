import React from "react";
import ReactMarkdown from "react-markdown";

export default function ChatMessages({ messages, isLoading, setLatestMessageRef }) {
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
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .message-animate {
            animation: slideUpFade 0.3s ease forwards;
          }

          @keyframes pulseLoader {
            0%, 100% { opacity: 0.5; transform: scale(0.8); }
            50%     { opacity: 1; transform: scale(1); }
          }
          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .typing-indicator span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #d1d5db;
            animation: pulseLoader 1.4s infinite;
          }
          .typing-indicator span:nth-child(1) { animation-delay: 0s; }
          .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
          .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
          
          .message-content p {
            margin: 0 0 12px 0;
            line-height: 1.5;
            text-align: left;
          }
          
          .message-content p:last-child {
            margin-bottom: 0;
          }
          
          .message-content ul, .message-content ol {
            margin: 8px 0;
            padding-left: 20px;
            text-align: left;
          }
          
          .message-content code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            background-color: rgba(0, 0, 0, 0.05);
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 0.9em;
          }
          
          .message-content pre {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            overflow-x: auto;
            margin: 10px 0;
            text-align: left;
          }
          
          .message-content pre code {
            background-color: transparent;
            padding: 0;
            font-size: 0.9em;
            white-space: pre;
          }
        `}
      </style>

      {messages.map((msg, idx) => {
        const isUser = msg.sender === "user";
        const isLastMessage = idx === messages.length - 1;
        
        return (
          <div
            key={idx}
            className="message-animate"
            ref={isLastMessage && !isLoading ? setLatestMessageRef : null}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: "16px",
              position: "relative",
            }}
          >
            <div
              style={{
                maxWidth: isUser ? "80%" : "90%",
                padding: isUser ? "10px 16px" : "12px 16px",
                borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: isUser ? "#0ea5e9" : "#f8fafc",
                color: isUser ? "#ffffff" : "#334155",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                border: isUser ? "none" : "1px solid #e2e8f0",
                wordWrap: "break-word",
                fontSize: "15px",
                fontWeight: isUser ? "400" : "400",
                textAlign: "left",
              }}
              className={`message-content ${!isUser ? "ai-message" : ""}`}
            >
              {isUser ? (
                msg.text
              ) : (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div
          className="message-animate"
          ref={setLatestMessageRef}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "4px 18px 18px 18px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              textAlign: "left",
            }}
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}