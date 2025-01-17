import Image from "next/image";
import logo from "../../assets/logo.png";

export const CartModal = ({ cartState, cartActions }) => {
  return (
    <div
      className={`${
        window.innerWidth < 768 
          ? "w-full fixed inset-0 bg-white" 
          : "w-96 h-[600px] fixed bottom-5 left-5 rounded-2xl"
      } z-50 flex flex-col overflow-hidden shadow-lg bg-white`}
      style={{
        ...(window.innerWidth < 768 ? {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: '100dvh'
        } : {})
      }}
    >
      {/* Cart Header */}
      <div className="flex justify-between items-center p-4 bg-gray-200 sticky top-0">
        <div className="flex items-center gap-2">
          <Image 
            src={logo} 
            alt="Cart Logo" 
            className="w-8 h-8 rounded-full object-cover"
            width={32}
            height={32}
          />
          <h4 className="text-lg font-bold">Shopping Cart</h4>
        </div>
        <button
          className="p-1 rounded-md hover:bg-gray-300 hover:scale-105 transition-all duration-200 border border-transparent hover:border-gray-400"
          onClick={cartActions.closeCart}
          aria-label="Close Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
            <path d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z" fill="#0D0D0D"/>
          </svg>
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-1 bg-white p-4 overflow-y-auto flex items-center justify-center">
        <p className="text-gray-500 text-center">No items in your cart</p>
      </div>

      {/* Cart Footer */}
      <div className="p-4">
        <button
          className="w-full mb-2 p-2 bg-blue-500 text-white rounded-lg"
          onClick={cartActions.checkout}
        >
          Checkout
        </button>
        <button
          className="w-full p-2 text-black"
          onClick={cartActions.clearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}; 