import { useState } from "react";
import PropTypes from "prop-types";
import "./CheckoutModal.css";

const CheckoutModal = ({
  isVisible,
  onClose,
  cart,
  setOrderRequests,
  clearCart,
}) => {
  const [name, setName] = useState(""); // Customer's name
  const [address, setAddress] = useState(""); // Customer's address
  const [orderComplete, setOrderComplete] = useState(false); // Order completion status
  const [message, setMessage] = useState(""); // Confirmation message

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the order object
    const order = {
      name,
      address,
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
        console.error("Failed to submit order:", response);
        setMessage(
          "An error occurred while submitting your order. Please try again later."
        );
        return;
      }
      const createdOrder = await response.json();
      order.id = createdOrder.id; // Assign the ID from the server

      // Add the order to the list of orders
      setOrderRequests((prevOrders) => [...prevOrders, order]);

      // Clear the cart
      clearCart();

      // Show confirmation message and mark as complete
      setOrderComplete(true);
      setMessage("Your order is complete! Check your email for updates.");
    } catch (error) {
      console.error("Error submitting order:", error);
      setMessage(
        "An error occurred while submitting your order. Please try again later."
      );
      return;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Checkout</h2>
        {!orderComplete ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-1">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2 border w-full"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="p-2 border w-full"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
              >
                Confirm Order
              </button>
            </div>
          </form>
        ) : (
          <div className="text-green-500 font-bold mt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

CheckoutModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // Allow both number and string
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  setOrderRequests: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
};

export default CheckoutModal;
