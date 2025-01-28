import Image from "next/image";
import logo from "../../assets/logo.png";

export const ChatHeader = ({ onMinimize, onClose }) => {
  return (
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
          onClick={onMinimize}
          aria-label="Minimize"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <rect x="5" y="11" width="14" height="2" />
          </svg>
        </button>
        <button
          className="p-1 rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200 border border-transparent hover:border-gray-400"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
            <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z" fill="#0D0D0D"/>
          </svg>
        </button>
      </div>
    </div>
  );
};