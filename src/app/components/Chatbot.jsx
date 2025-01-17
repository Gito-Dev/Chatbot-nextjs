"use client"
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import Image from "next/image";


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showCloseOptions, setShowCloseOptions] = useState(false);
  const [botMessage, setBotMessage] = useState(""); // Bot's current message
  const [isTyping, setIsTyping] = useState(false); // State for typing effect
  const [showCart, setShowCart] = useState(false);
  const [showCartConfirm, setShowCartConfirm] = useState(false);
  const [cartAction, setCartAction] = useState(''); // 'clear' or 'checkout'

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Always show typing indicator first
    setIsTyping(true);
    
    // Wait for 2 seconds to show the typing animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        message: input,
      });

      setIsTyping(false);
      setBotMessage(response.data.reply);
      setMessages((prev) => [...prev, { text: response.data.reply, sender: "bot" }]);

    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setBotMessage("Failed to fetch reply");
      setMessages((prev) => [...prev, { text: "Failed to fetch reply", sender: "bot" }]);
    }
  };

//  handle close button
  const handleClose = () => {
    setShowCloseOptions(true);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleEndConversation = () => {
    setMessages([]);
    setIsOpen(false);
    setShowCloseOptions(false);
  };

  const handleCancelClose = () => {
    setShowCloseOptions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  return (


    // main container
    <div className="fixed bottom-14 left-7 z-50">
      {!isOpen && (
        <button
          className="w-[55px] h-[55px] bg-blue-500 text-white rounded-full shadow-lg relative overflow-hidden hover:scale-110 transition-transform duration-200 border-2 border-blue-600"
          onClick={toggleChat}
        >
          <Image 
            src={logo} 
            alt="Chat"
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
        </button>
      )}
      {isOpen && ( 
        <div
          className={`${
            window.innerWidth < 768 
              ? "w-full fixed inset-0 bg-white" 
              : "w-96 h-[600px] fixed bottom-5 left-5 rounded-2xl"
          } z-50 flex flex-col overflow-hidden shadow-lg`}
          style={{
            ...(window.innerWidth < 768 ? {
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              height: '100dvh'
            } : {})
          }}
        >

          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gray-200 sticky top-0">
            <div className="flex items-center gap-2">
              <Image 
                src={logo} 
                alt="Chat Logo" 
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
              />
              <h4 className="text-lg font-bold">HighSky AI Chat</h4>
            </div>
            <div className="space-x-2 flex items-center">
              <button
                className="p-1 rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200 border border-transparent hover:border-gray-400"
                onClick={handleCartClick}
                aria-label="Cart"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 32 32"
                >
                  <path d="M30.622 9.602h-22.407l-1.809-7.464h-5.027v1.066h4.188l5.198 21.443c-1.108 0.323-1.923 1.334-1.923 2.547 0 1.472 1.193 2.666 2.666 2.666s2.666-1.194 2.666-2.666c0-0.603-0.208-1.153-0.545-1.599h7.487c-0.337 0.446-0.545 0.997-0.545 1.599 0 1.472 1.193 2.666 2.665 2.666s2.666-1.194 2.666-2.666c0-1.473-1.193-2.665-2.666-2.666v0h-11.403l-0.517-2.133h14.968l4.337-12.795zM13.107 27.196c0 0.882-0.717 1.599-1.599 1.599s-1.599-0.717-1.599-1.599c0-0.882 0.717-1.599 1.599-1.599s1.599 0.718 1.599 1.599zM24.836 27.196c0 0.882-0.718 1.599-1.6 1.599s-1.599-0.717-1.599-1.599c0-0.882 0.717-1.599 1.599-1.599 0.882 0 1.6 0.718 1.6 1.599zM11.058 21.331l-2.585-10.662h20.662l-3.615 10.662h-14.462z" />
                </svg>
              </button>
              <button
                className="p-1 rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200 border border-transparent hover:border-gray-400"
                onClick={handleMinimize}
                aria-label="Minimize"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <rect x="5" y="11" width="14" height="2" />
                </svg>
              </button>
              <button
                className="p-1 rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200 border border-transparent hover:border-gray-400"
                onClick={handleClose}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z" fill="#0D0D0D"/>                
                </svg>
              </button>
            </div>
          </div>



          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
            {/* Welcome message stays at top */}
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
            
            {/* Messages container with auto margin top to push content to bottom */}
            <div className="flex-1 flex flex-col justify-end">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right flex justify-end" : "text-left"
                  }`}
                >
                  <div className={`flex items-start gap-2 max-w-[60%] ${
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
                    <span
                      className={`inline-block p-2 whitespace-pre-wrap break-words text-left ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white text-sm font-light rounded-md rounded-tr-sm"
                          : "bg-gray-300 rounded-md text-sm font-light rounded-tl-sm"
                      }`}
                    >
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
                    <span className="inline-block  p-2 rounded-md rounded-tl-sm">
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



          {/* Input or Close Options */}
          <div className="p-4 bg-white">
            {!showCloseOptions ? (
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none focus:outline-none pr-10 border-gray-400 placeholder:text-gray-600"
                  placeholder="Message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {input && (
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:scale-105 transition-all duration-200"
                    onClick={handleSend}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      className="w-4 h-4"
                      fill="white"
                    >
                      <path d="m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z" />
                    </svg>
                  </span>
                )}
              </div>
            ) : (
              <>
                <button
                  className="w-full mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-102 transition-all duration-200 "
                  onClick={handleEndConversation}
                >
                  End Conversation
                </button>
                <button
                  className="w-full mt-2 p-2  text-black "
                  onClick={handleCancelClose}
                >
                  Cancel
                </button>
              </>
            )}
            <p className="text-center text-xs mt-2">
              Made by <a href="https://www.highsky.ai/" className="text-blue-500">HighSky AI</a>
            </p>
          </div>



        </div>


      )}



      {/* Cart Container */}
      {showCart && (
        <div
          className={`${
            window.innerWidth < 768 
              ? "w-full fixed inset-0 bg-white" 
              : "w-96 h-[600px] fixed bottom-5 left-5 rounded-2xl"
          } z-50 flex flex-col overflow-hidden shadow-lg bg-white`}
          style={{
            ...(window.innerWidth < 768 ? {
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              height: '100dvh'
            } : {})
          }}
        >
          {/* Cart Header */}
          <div className="flex justify-between items-center p-4 bg-gray-200 sticky top-0">
            <div className="flex items-center gap-2">
              <Image 
                src={logo} 
                alt="Cart Logo" 
                className="w-8 h-8 rounded-full object-cover"
                width={32}
                height={32}
              />
              <h4 className="text-lg font-bold">Shopping Cart</h4>
            </div>
            <button
              className="p-1 rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200 border border-transparent hover:border-gray-400"
              onClick={() => setShowCart(false)}
              aria-label="Close Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z" fill="#0D0D0D"/>
              </svg>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 bg-white p-4 overflow-y-auto flex items-center justify-center">
            <p className="text-gray-500 text-center">No items in your cart</p>
          </div>

          {/* Cart Footer - Direct actions without confirmation */}
          <div className="p-4 ">
            <button
              className="w-full mb-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-102 transition-all duration-200 "
              onClick={() => {
                // Add your checkout logic here
                setShowCart(false);
              }}
            >
              Checkout
            </button>
            <button
              className="w-full p-2  text-black "
              onClick={() => {
                // Add your clear cart logic here
                setShowCart(false);
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

