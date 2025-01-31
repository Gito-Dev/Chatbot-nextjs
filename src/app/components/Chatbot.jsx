"use client"
import React, { useState } from "react";
import axios from "axios";
import { ChatButton } from "./Chat/ChatButton";
import { ChatHeader } from "./Chat/ChatHeader";
import { MessageList } from "./Chat/MessageList";
import { MessageInput } from "./Chat/MessageInput";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      const response = await axios.post(
        "/api/chat",
        {
          message: input,
          session_id: sessionId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log('API Response:', response.data); // Debug log

      // Get the latest message from agent_response.messages
      const messagesArray = response.data.agent_response?.messages || [];
      const latestMessage = messagesArray[messagesArray.length - 1]?.content || "No response from agent";

      setIsTyping(false);
      setMessages((prev) => [...prev, { text: latestMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: "Sorry, I encountered an error. Please try again.", sender: "bot" }]);
    }
  };

  const handleClose = () => {
    if (messages.length > 0) {
      setShowConfirmDialog(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-14 left-7 z-50">
      {!isOpen ? (
        <ChatButton onClick={toggleChat} />
      ) : (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: isOpen ? "0%" : "100%" }}
          transition={{ duration: 0.2 }}
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
          <ChatHeader 
            onMinimize={() => setIsOpen(false)}
            onClose={handleClose}
          />
          <MessageList 
            messages={messages}
            isTyping={isTyping}
          />
          <MessageInput 
            input={input}
            setInput={setInput}
            onSend={handleSend}
            showConfirmDialog={showConfirmDialog}
            onEndConversation={() => {
              setMessages([]);
              setInput("");
              setShowConfirmDialog(false);
              setIsOpen(false);
            }}
            onCancelClose={() => setShowConfirmDialog(false)}
            disabled={isTyping}
          />
        </motion.div>
      )}
    </div>
  );
}