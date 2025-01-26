export const MessageInput = ({ input, setInput, onSend, showConfirmDialog, onEndConversation, onCancelClose }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !showConfirmDialog) {
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white relative">
      {!showConfirmDialog ? (
        <>
          <div className="relative mb-2">
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none pr-12 border-gray-400 placeholder:text-gray-600"
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
          <p className="text-center text-xs text-gray-500">
            Powered by <a href="https://www.highsky.ai/" className="text-blue-500 hover:underline">HighSky AI</a>
          </p>
        </>
      ) : (
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Are you sure you want to end this conversation? This will clear the chat history.
          </p>
          <button
            className="w-full mb-3 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-102 transition-all duration-200"
            onClick={onEndConversation}
          >
            End Conversation
          </button>
          <button
            className="w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            onClick={onCancelClose}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}; 