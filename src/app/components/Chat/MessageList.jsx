import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";

export const MessageList = memo(({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [productIndices, setProductIndices] = useState({});

  // Scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "instant", // Changed from "smooth" to "instant"
        block: "end"
      });
    }
  }, [messages, isTyping, autoScroll]);

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    const element = e.target;
    const isAtBottom = Math.abs(
      element.scrollHeight - element.scrollTop - element.clientHeight
    ) < 50; // threshold of 50px
    
    setAutoScroll(isAtBottom);
  }, []);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "instant",
        block: "end"
      });
    }
  }, []);

  const renderProductCarousel = (msg, messageIndex) => {
    const products = [];

    if (msg.product1Title) {
      products.push({
        title: msg.product1Title,
        image: msg.product1Image1,
        price: msg.product1Price,
        url: msg.product1Url,
      });
    }
    if (msg.product2Title) {
      products.push({
        title: msg.product2Title,
        image: msg.product2Image1,
        price: msg.product2Price,
        url: msg.product2Url,
      });
    }
    if (msg.product3Title) {
      products.push({
        title: msg.product3Title,
        image: msg.product3Image1,
        price: msg.product3Price,
        url: msg.product3Url,
      });
    }

    if (products.length === 0) return null;

    const currentIndex = productIndices[messageIndex] || 0;

    const nextProduct = () => {
      setProductIndices(prev => ({
        ...prev,
        [messageIndex]: (currentIndex + 1) % products.length
      }));
    };

    const previousProduct = () => {
      setProductIndices(prev => ({
        ...prev,
        [messageIndex]: currentIndex === 0 ? products.length - 1 : currentIndex - 1
      }));
    };

    return (
      <div className="relative w-full mt-4">
        <div className="flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-[250px]"
            >
              {products[currentIndex].image && (
                <div className="relative w-full aspect-video mb-3">
                  <Image
                    src={products[currentIndex].image}
                    alt={products[currentIndex].title || 'Product Image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-cover"
                    priority
                  />
                </div>
              )}
              <div className="space-y-2">
                {products[currentIndex].title && (
                  <h3 className="font-medium text-gray-800">
                    {products[currentIndex].title}
                  </h3>
                )}
                {products[currentIndex].price && (
                  <p className="text-lg font-semibold text-blue-600">
                    {products[currentIndex].price}
                  </p>
                )}
                {products[currentIndex].url && (
                  <motion.a
                    href={products[currentIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Product
                  </motion.a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {products.length > 1 && (
          <>
            <motion.button
              className="absolute left-0 top-[40%] -ml-12 p-1.5 bg-white/80 rounded-full shadow-md hover:bg-white/90"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={previousProduct}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </motion.button>
            <motion.button
              className="absolute right-0 top-[40%] -mr-12 p-1.5 bg-white/80 rounded-full shadow-md hover:bg-white/90"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextProduct}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Pagination dots */}
        {products.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setProductIndices(prev => ({ ...prev, [messageIndex]: index }))}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMessage = useCallback((msg, index) => {
    return (
      <div key={`${index}-${msg.content || msg.text}`} className={`mb-2 ${msg.sender === "user" ? "text-right flex justify-end" : "text-left"}`}>
        <div className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse max-w-[70%]" : "flex-row max-w-[80%]"}`}>
          {msg.sender === "bot" && (
            <Image src={logo} alt="Bot" className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0" width={32} height={32} />
          )}
          <div className={`inline-block p-3 whitespace-pre-wrap break-words text-left ${
            msg.sender === "user"
              ? "bg-blue-500 text-white text-sm font-light rounded-md"
              : "bg-gray-100 rounded-md text-sm font-light"
          }`}>
            {msg.sender === "bot" ? (
              <>
                {msg.isNew ? (
                  <TypeAnimation sequence={[msg.content || msg.text || ""]} wrapper="span" speed={75} cursor={false} />
                ) : (
                  <span>{msg.content || msg.text || ""}</span>
                )}
                {msg.displayChoice === 'yes' && renderProductCarousel(msg, index)}
              </>
            ) : (
              <span>{msg.content || msg.text || ""}</span>
            )}
          </div>
        </div>
      </div>
    );
  }, [productIndices]);

  return (
    <div 
      ref={containerRef} 
      className="h-full overflow-y-auto p-4 bg-white flex flex-col relative hide-scrollbar" 
      onScroll={handleScroll}
      style={{
        msOverflowStyle: 'none',  // IE and Edge
        scrollbarWidth: 'none',   // Firefox
      }}
    >
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

// Add this CSS at the top of your file or in your global CSS
const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

MessageList.displayName = "MessageList";