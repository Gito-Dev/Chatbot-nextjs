import Image from "next/image";
import logo from "../../assets/logo.png";

export const ChatButton = ({ onClick }) => {
  return (
    <button
      className="w-[60px] h-[60px] bg-blue-500 text-white rounded-full shadow-lg relative overflow-hidden hover:scale-110 transition-transform duration-200 border-2 border-blue-600"
      onClick={onClick}
    >
      <Image 
        src={logo} 
        alt="Chat"
        className="absolute inset-0 w-full h-full object-cover"
        priority
      />
    </button>
  );
}; 