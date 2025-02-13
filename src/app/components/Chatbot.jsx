"use client"
import React, { useState, useEffect, useRef } from "react";
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
  const abortControllerRef = useRef(null);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they changey
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      const response = await axios.post(
        "/api/chat",
        {
          message: input.trim(),
          session_id: sessionId,
          chat_history: messages.map(msg => ({
            content: msg.text || msg.content,
            role: msg.sender === 'user' ? 'user' : 'assistant'
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data) {
        const botMessage = {
          sender: "bot",
          content: response.data.message,
          isNew: true,
          displayChoice: response.data.displayChoice,
          product1Title: response.data.product1Title,
          product1Image1: response.data.product1Image1,
          product1Price: response.data.product1Price,
          product1Url: response.data.product1Url,
          product2Title: response.data.product2Title,
          product2Image1: response.data.product2Image1,
          product2Price: response.data.product2Price,
          product2Url: response.data.product2Url,
          product3Title: response.data.product3Title,
          product3Image1: response.data.product3Image1,
          product3Price: response.data.product3Price,
          product3Url: response.data.product3Url
        };

        console.log('Bot message with products:', botMessage); // Debug log

        setIsTyping(false);
        setMessages(prev => [...prev, botMessage]);

        // Remove isNew flag after animation
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg === botMessage ? { ...msg, isNew: false } : msg
            )
          );
        }, 1000);
      }

    } catch (error) {
      console.error("API Error Details:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: "I apologize, but I encountered an error. Please try again.",
        sender: "bot",
        isNew: false
      }]);
    }
  };

  const handleClose = () => {
    // Cancel ongoing request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
    
    if (messages.length > 0) {
      setShowConfirmDialog(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleEndConversation = () => {
    // Cancel ongoing request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
    
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setInput("");
    setShowConfirmDialog(false);
    setIsOpen(false);
  };

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
              : "w-96 h-[750px] fixed bottom-10 left-10 rounded-2xl"
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
            onEndConversation={handleEndConversation}
            onCancelClose={() => setShowConfirmDialog(false)}
            disabled={isTyping}
          />
        </motion.div>
      )}
    </div>
  );
}