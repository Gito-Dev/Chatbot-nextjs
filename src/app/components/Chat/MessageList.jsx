import React, { useRef, useEffect } from "react";
import Image from "next/image";
import logo from "../../assets/logo.png";

export const MessageList = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
      {/* Welcome message */}
      <div className="flex flex-col items-center mt-8 mb-8 flex-shrink-0">
        <Image 
          src={logo} 
          alt="Chat Logo" 
          className="w-20 h-20 rounded-full object-cover"
          width={80}
          height={80}
        />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Welcome to HighSky AI Chat!</h3>
          <p className="text-gray-600 text-sm font-light">How can I assist you today?</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col justify-end">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === "user" ? "text-right flex justify-end" : "text-left"}`}
          >
            <div className={`flex items-start gap-2 max-w-[50%] ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}>
              {msg.sender === "bot" && (
                <Image 
                  src={logo} 
                  alt="Bot" 
                  className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0"
                  width={32}
                  height={32}
                />
              )}
              <span className={`inline-block p-2 whitespace-pre-wrap break-words text-left ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white text-sm font-light rounded-md rounded-tr-sm"
                  : "bg-gray-300 rounded-md text-sm font-light rounded-tl-sm"
              }`}>
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-left mb-2">
            <div className="flex items-center gap-2">
              <Image 
                src={logo} 
                alt="Bot" 
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
              />
              <span className="inline-block p-2 rounded-md rounded-tl-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-bounce1"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-bounce2"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-bounce3"></div>
                </div>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};