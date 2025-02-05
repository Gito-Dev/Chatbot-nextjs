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
    if (!input) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
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
          withCredentials: true,
          signal: abortControllerRef.current.signal
        }
      );

      // Only process response if request wasn't aborted
      if (!abortControllerRef.current.signal.aborted) {
        console.log('API Response:', response.data);

        const botMessage = {
          sender: "bot",
          content: response.data.message,
          isNew: true,
          ...response.data
        };

        setIsTyping(false);
        setMessages((prev) => [...prev, botMessage]);

        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg === botMessage ? { ...msg, isNew: false } : msg
            )
          );
        }, 1000);
      }

    } catch (error) {
      // Only show error if request wasn't aborted
      if (!axios.isCancel(error)) {
        console.error("Error:", error);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { 
            text: "Sorry, I encountered an error. Please try again.",
            sender: "bot",
            isNew: false
          }
        ]);
      }
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