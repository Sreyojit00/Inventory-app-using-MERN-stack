import React, { useEffect, useState } from "react";
import { useShoppingCartStore } from "../components/useShoppingCartStore"; // Adjust path as needed
import Dashboard from "../pages/Dashboard";

const CartPage = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    initializeCart,
    clearCart,
  } = useShoppingCartStore();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  // Initialize the cart when the page loads, if the user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      initializeCart(userId);
    }
  }, [initializeCart]);
  
  // Calculate total cost
  const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    setIsPaymentProcessing(true);
  
    // Simulate payment delay
    setTimeout(async () => {
      try {
        // Call the backend to update inventory
        const response = await fetch("https://inventory-app-using-mern-stack-13.onrender.com/api/update-inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
        });
  
        if (response.ok) {
          console.log("Inventory updated successfully");
          setIsPaymentDone(true);
          clearCart(); // Clear the cart after successful checkout
        } else {
          console.error("Failed to update inventory");
        }
      } catch (error) {
        console.error("Error during payment or inventory update:", error);
      } finally {
        setIsPaymentProcessing(false);
      }
    }, 2000);
  };
  

  // Close the payment success overlay
  const handleCloseSuccess = () => {
    setIsPaymentDone(false);
  };

  <Dashboard totalCost={totalCost}/>

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          Your cart is currently empty. Browse products and add them to your cart.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-separate border-spacing-0">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-medium text-gray-700">
                  Product
                </th>
                <th className="px-6 py-4 text-right text-lg font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-lg font-medium text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-4 text-right text-lg font-medium text-gray-700">
                  Total
                </th>
                <th className="px-6 py-4 text-right text-lg font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-700">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-200"
                      >
                        -
                      </button>
                      <span className="text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-200"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-700">
                    ₹{item.price * item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:underline transition duration-200"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center bg-gray-50 py-6 px-6 mt-6 rounded-b-lg">
            <div className="text-xl font-semibold text-gray-800">
              <span className="text-lg font-normal">Total:</span> ₹{totalCost.toFixed(2)}
            </div>
            <div>
              <button
                onClick={handlePayment}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                disabled={isPaymentProcessing || isPaymentDone}
              >
                {isPaymentProcessing
                  ? "Processing..."
                  : isPaymentDone
                    ? "Payment Done"
                    : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Payment Success */}
      {isPaymentDone && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 cursor-pointer"
          onClick={handleCloseSuccess}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            {/* Tick color changed to green */}
            <div className="text-green-600 text-6xl mb-4 animate-bounce">✔</div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600 mt-4">Click anywhere to close.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default CartPage;
