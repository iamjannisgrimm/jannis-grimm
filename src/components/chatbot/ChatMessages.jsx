import React from "react";
import ReactMarkdown from "react-markdown";

const ChatMessages = ({ messages, isLoading, setLatestMessageRef }) => {
  return (
    <div className="chat-messages" style={{ width: "100%", margin: 0, padding: 0 }}>
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

      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isUser = message.sender === "user";
        
        return (
          <div
            key={index}
            className={`message ${message.sender}`}
            ref={isLastMessage ? setLatestMessageRef : null}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: isLastMessage ? "0" : "10px",
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: isUser ? "#14A6FF" : "#f1f1f1",
                color: isUser ? "white" : "black",
                borderRadius: "18px",
                padding: "10px 16px",
                maxWidth: "85%",
                wordWrap: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                fontSize: "0.95rem",
                lineHeight: "1.4",
                whiteSpace: "pre-wrap",
              }}
              className={`message-content ${!isUser ? "ai-message" : ""}`}
            >
              {!isUser ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div
          className="message loading"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "0",
            width: "100%",
            marginTop: messages.length > 0 ? "10px" : "0",
          }}
        >
          <div
            style={{
              backgroundColor: "#f1f1f1",
              borderRadius: "18px",
              padding: "12px 16px",
              maxWidth: "85%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
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
};

export default ChatMessages;