import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, autoScroll]);

  const renderProductCarousel = (msg) => {
    // Create an array of all possible products
    const productKeys = [
      { title: 'product1Title', image: 'product1Image1', price: 'product1Price', url: 'product1Url' },
      { title: 'product2Title', image: 'product2Image1', price: 'product2Price', url: 'product2Url' },
      { title: 'product3Title', image: 'product3Image1', price: 'product3Price', url: 'product3Url' }
    ];

    // Filter and map only the products that exist in the message
    const products = productKeys
      .map(keys => ({
        title: msg[keys.title],
        image: msg[keys.image],
        price: msg[keys.price],
        url: msg[keys.url]
      }))
      .filter(product => product.title); // Only include products that have a title

    if (products.length === 0) return null;

    return (
      <motion.div
        className="flex overflow-x-auto space-x-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products.map((product, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm min-w-[250px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {product.image && (
              <div className="relative w-full aspect-video mb-3">
                <Image
                  src={product.image}
                  alt={product.title || 'Product Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-md object-cover"
                  priority
                />
              </div>
            )}
            <div className="space-y-2">
              {product.title && (
                <h3 className="font-medium text-gray-800">{product.title}</h3>
              )}
              {product.price && (
                <p className="text-lg font-semibold text-blue-600">{product.price}</p>
              )}
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                  View Product
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
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
                {msg.displayChoice === 'yes' && renderProductCarousel(msg)}
              </>
            ) : (
              <span>{msg.content || msg.text || ""}</span>
            )}
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-full overflow-y-auto p-4 bg-white flex flex-col" 
      onScroll={handleScroll}
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

MessageList.displayName = "MessageList";