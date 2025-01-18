export const MessageInput = ({ input, setInput, onSend }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white">
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
            onClick={onSend}
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
      <p className="text-center text-xs mt-2">
        Powered by <a href="https://www.highsky.ai/" className="text-blue-500">HighSky AI</a>
      </p>
    </div>
  );
}; 