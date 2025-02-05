import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { TypeAnimation } from 'react-type-animation';

export const MessageList = memo(({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Improved scroll handler with threshold
  const handleScroll = useCallback((e) => {
    const element = e.target;
    const threshold = 100; // pixels from bottom
    const isNearBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    setAutoScroll(isNearBottom);
  }, []);

  // Enhanced scroll effect
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      const scrollOptions = {
        behavior: "smooth",
        block: "end",
      };
      
      // Force scroll to bottom for new messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView(scrollOptions);
      }, 100);
    }
  }, [messages, isTyping, autoScroll]);

  // Force scroll to bottom when component mounts
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, []);

  // Remove console.log in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      messages.forEach(msg => {
        console.log('Message data:', msg);
      });
    }
  }, [messages]);

  const renderProductCard = (product) => {
    console.log('Product data:', product); // Debug log

    return (
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <a href={product.url} target="_blank" rel="noopener noreferrer" className="flex flex-col">
          <img 
            src={product.image1} 
            alt={product.title} 
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              console.log('Image error:', e); // Debug log
              e.target.onerror = null;
              e.target.src = '/placeholder-image.png';
            }}
          />
          <div className="p-2">
            <h4 className="font-medium">{product.title}</h4>
            <p className="text-blue-600">${product.price}</p>
          </div>
        </a>
      </div>
    );
  };

  const renderMessage = useCallback((msg, index) => {
    return (
      <div
        key={index}
        className={`mb-2 ${msg.sender === "user" ? "text-right flex justify-end" : "text-left"}`}
      >
        <div className={`flex items-start gap-2 ${
          msg.sender === "user" ? "flex-row-reverse max-w-[70%]" : "flex-row max-w-[80%]"
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
          <span className={`inline-block p-3 whitespace-pre-wrap break-words text-left ${
            msg.sender === "user"
              ? "bg-blue-500 text-white text-sm font-light rounded-md "
              : "bg-gray-100 rounded-md text-sm font-light "
          }`}>
            {msg.sender === "bot" ? (
              <div>
                {msg.isNew ? (
                  <TypeAnimation
                    sequence={[msg.content || msg.text || '']}
                    wrapper="span"
                    speed={75}
                    cursor={false}
                  />
                ) : (
                  <span>{msg.content || msg.text || ''}</span>
                )}
                
                {/* Product Display Section */}
                {msg.displayChoice && (
                  <div className="mt-4 space-y-4">
                    {msg.hasOneProduct && msg.product1Image1 && msg.product1Title && (
                      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                        <a href={msg.product1Url || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col">
                          <div className="w-full h-48 relative">
                            <img 
                              src={msg.product1Image1}
                              alt={msg.product1Title}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium">{msg.product1Title}</h4>
                            <p className="text-blue-600">{msg.product1Price}</p>
                          </div>
                        </a>
                      </div>
                    )}

                    {msg.hasTwoProducts && (
                      <div className="grid grid-cols-2 gap-4">
                        {msg.product1Image1 && msg.product1Title && (
                          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                            <a href={msg.product1Url || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col">
                              <div className="w-full h-48 relative">
                                <img 
                                  src={msg.product1Image1}
                                  alt={msg.product1Title}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-medium">{msg.product1Title}</h4>
                                <p className="text-blue-600">{msg.product1Price}</p>
                              </div>
                            </a>
                          </div>
                        )}
                        {msg.product2Image1 && msg.product2Title && (
                          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                            <a href={msg.product2Url || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col">
                              <div className="w-full h-48 relative">
                                <img 
                                  src={msg.product2Image1}
                                  alt={msg.product2Title}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-medium">{msg.product2Title}</h4>
                                <p className="text-blue-600">{msg.product2Price}</p>
                              </div>
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.hasThreeProducts && (
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { url: msg.product1Url, image: msg.product1Image1, title: msg.product1Title, price: msg.product1Price },
                          { url: msg.product2Url, image: msg.product2Image1, title: msg.product2Title, price: msg.product2Price },
                          { url: msg.product3Url, image: msg.product3Image1, title: msg.product3Title, price: msg.product3Price }
                        ].filter(product => product.image && product.title).map((product, idx) => (
                          <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                            <a href={product.url || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col">
                              <div className="w-full h-48 relative">
                                <img 
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-medium">{product.title}</h4>
                                <p className="text-blue-600">{product.price}</p>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              (msg.content || msg.text || '').split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== (msg.content || msg.text || '').split('\n').length - 1 && <br />}
                </React.Fragment>
              ))
            )}
          </span>
        </div>
      </div>
    );
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto p-4 bg-white flex flex-col"
      onScroll={handleScroll}
      style={{ 
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      {/* Welcome message */}
      <div className={`flex-shrink-0 flex flex-col items-center mb-8 ${messages.length > 0 ? '' : 'flex-grow justify-center'}`}>
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

      {/* Messages container - with flex-grow and justify-end */}
      <div className="flex-grow flex flex-col justify-end">
        <div className="flex flex-col space-y-4">
          {messages.map(renderMessage)}
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
    </div>
  );
});

MessageList.displayName = 'MessageList';