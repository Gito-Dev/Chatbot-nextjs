import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { TypeAnimation } from "react-type-animation";

export const MessageList = memo(({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const handleScroll = useCallback((e) => {
    const element = e.target;
    const threshold = 100;
    setAutoScroll(element.scrollHeight - element.scrollTop - element.clientHeight < threshold);
  }, []);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isTyping, autoScroll]);

  // Improved debugging: only log messages in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Updated Messages:", messages);
    }
  }, [messages]);

  const renderMessage = useCallback((msg, index) => {
    return (
      <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right flex justify-end" : "text-left"}`}>
        <div className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse max-w-[70%]" : "flex-row max-w-[80%]"}`}>
          {msg.sender === "bot" && (
            <Image src={logo} alt="Bot" className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" width={32} height={32} />
          )}
          <span className={`inline-block p-3 whitespace-pre-wrap break-words text-left ${
            msg.sender === "user"
              ? "bg-blue-500 text-white text-sm font-light rounded-md"
              : "bg-gray-100 rounded-md text-sm font-light"
          }`}>
            {msg.sender === "bot" ? (
              msg.isNew ? (
                <TypeAnimation sequence={[msg.content || msg.text || ""]} wrapper="span" speed={75} cursor={false} />
              ) : (
                <span>{msg.content || msg.text || ""}</span>
              )
            ) : (
              (msg.content || msg.text || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== (msg.content || msg.text || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))
            )}
          </span>
        </div>
      </div>
    );
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto p-4 bg-white flex flex-col" onScroll={handleScroll}>
      <div className="flex-shrink-0 flex flex-col items-center mb-8">
        <Image src={logo} alt="Chat Logo" className="w-20 h-20 rounded-full object-cover" width={80} height={80} />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Welcome to HighSky AI Chat!</h3>
          <p className="text-gray-600 text-sm font-light">How can I assist you today?</p>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-end">
        <div className="flex flex-col space-y-4">
          {messages.map(renderMessage)}
          {isTyping && (
            <div className="text-left mb-2">
              <div className="flex items-center gap-2">
                <Image src={logo} alt="Bot" className="w-8 h-8 rounded-full object-cover" width={32} height={32} />
                <span className="inline-block p-2 rounded-md">
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
    </div>
  );
});

MessageList.displayName = "MessageList";
