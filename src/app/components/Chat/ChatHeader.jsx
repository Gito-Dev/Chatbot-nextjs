import Image from "next/image";
import logo from "../../assets/logo.png";

export const ChatHeader = ({ onMinimize, onClose, onCartClick }) => {
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
          onClick={onCartClick}
          aria-label="Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
            <path d="M30.622 9.602h-22.407l-1.809-7.464h-5.027v1.066h4.188l5.198 21.443c-1.108 0.323-1.923 1.334-1.923 2.547 0 1.472 1.193 2.666 2.666 2.666s2.666-1.194 2.666-2.666c0-0.603-0.208-1.153-0.545-1.599h7.487c-0.337 0.446-0.545 0.997-0.545 1.599 0 1.472 1.193 2.666 2.665 2.666s2.666-1.194 2.666-2.666c0-1.473-1.193-2.665-2.666-2.666v0h-11.403l-0.517-2.133h14.968l4.337-12.795zM13.107 27.196c0 0.882-0.717 1.599-1.599 1.599s-1.599-0.717-1.599-1.599c0-0.882 0.717-1.599 1.599-1.599s1.599 0.718 1.599 1.599zM24.836 27.196c0 0.882-0.718 1.599-1.6 1.599s-1.599-0.717-1.599-1.599c0-0.882 0.717-1.599 1.599-1.599 0.882 0 1.6 0.718 1.6 1.599zM11.058 21.331l-2.585-10.662h20.662l-3.615 10.662h-14.462z" />
          </svg>
        </button>
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