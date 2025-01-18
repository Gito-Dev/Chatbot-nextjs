"use client"
import React, { useState } from "react";
import axios from "axios";
import { ChatButton } from "./Chat/ChatButton";
import { ChatHeader } from "./Chat/ChatHeader";
import { MessageList } from "./Chat/MessageList";
import { MessageInput } from "./Chat/MessageInput";
import { CartModal } from "./Chat/CartModal";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cartState, setCartState] = useState({
    showCart: false,
    action: ''
  });

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        message: input,
      });

      setIsTyping(false);
      setMessages((prev) => [...prev, { text: response.data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: "Failed to fetch reply", sender: "bot" }]);
    }
  };

  const cartActions = {
    openCart: () => setCartState({
      showCart: true,
      action: ''
    }),
    
    closeCart: () => setCartState({
      showCart: false,
      action: ''
    }),
    
    checkout: () => {
      setCartState({
        showCart: false,
        action: 'checkout'
      });
    },
    
    clearCart: () => {
      setCartState({
        showCart: false,
        action: 'clear'
      });
    }
  };

  return (
    <div className="fixed bottom-14 left-7 z-50">
      {!isOpen ? (
        <ChatButton onClick={toggleChat} />
      ) : (
        <div className={`${
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
          <ChatHeader 
            onMinimize={() => setIsOpen(false)}
            onClose={() => setIsOpen(false)}
            onCartClick={cartActions.openCart}
          />
          <MessageList 
            messages={messages}
            isTyping={isTyping}
          />
          <MessageInput 
            input={input}
            setInput={setInput}
            onSend={handleSend}
          />
        </div>
      )}
      
      {cartState.showCart && (
        <CartModal 
          cartState={cartState}
          cartActions={cartActions}
        />
      )}
    </div>
  );
}

