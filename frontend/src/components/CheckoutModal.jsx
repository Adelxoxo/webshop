import { useState } from "react";
import PropTypes from "prop-types";

const CheckoutModal = ({
  isVisible,
  onClose,
  cart,
  setOrderRequests,
  clearCart,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  // Calculate order total
  const orderTotal = cart.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the order object
    const order = {
      name,
      address,
      email,
      products: cart,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdOrder = await response.json();
      order.id = createdOrder.id;

      // Add the order to the list of orders
      setOrderRequests((prevOrders) => [...prevOrders, order]);

      // Clear the cart
      clearCart();

      // Show confirmation message and mark as complete
      setOrderComplete(true);
      setMessage("Your order has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      setMessage(
        "An error occurred while submitting your order. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-md w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Checkout</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        <div className="p-4">
          {!orderComplete ? (
            <>
              {/* Order Summary */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li key={item.id} className="py-2 flex justify-between">
                        <span>
                          {item.name} {item.quantity > 1 ? `× ${item.quantity}` : ''}
                        </span>
                        <span className="font-medium">
                          {((item.price * (item.quantity || 1)).toFixed(2))}KM
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{orderTotal.toFixed(2)}KM</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="p-2 border rounded-md w-full focus:outline-none focus:border-slate-700"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-2 border rounded-md w-full"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Address:</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows="3"
                    className="p-2 border rounded-md w-full focus:outline-none focus:border-slate-700"
                    placeholder="Enter your complete delivery address"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 rounded-md text-white font-medium ${
                      isSubmitting
                        ? "bg-green-600 animate-pulse"
                        : "bg-slate-700 hover:bg-slate-800"
                    } transition-colors`}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Order"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-green-500 font-bold mb-2">{message}</div>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CheckoutModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number,
    })
  ).isRequired,
  setOrderRequests: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
};

export default CheckoutModal;