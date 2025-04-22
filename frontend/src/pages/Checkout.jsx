import { useState } from 'react';
import PropTypes from 'prop-types';

function Checkout({ cart, setOrderRequests }) {
  const [name, setName] = useState(""); // Track customer's name
  const [address, setAddress] = useState(""); // Track customer's address
  const [orderComplete, setOrderComplete] = useState(false); // Track order completion
  const [message, setMessage] = useState(""); // Message after submitting the order

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the order object with customer details and cart items
    const order = {
      id: Date.now(), // Unique order ID based on timestamp
      name,
      address,
      items: cart,
      status: "pending", // Initial status is pending
    };

    // Update the order requests list in the parent component
    setOrderRequests((prevOrders) => [...prevOrders, order]);

    // Clear the cart after order submission
    localStorage.removeItem('cart');

    // Set the confirmation message and mark order as complete
    setOrderComplete(true);
    setMessage("Your order is complete! Check your email for updates.");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      {!orderComplete ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border"
            />
          </div>
          <div>
            <label className="block">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="p-2 border"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mt-2"
            >
              Confirm Order
            </button>
          </div>
        </form>
      ) : (
        <div className="text-green-500 font-bold">
          {message}
        </div>
      )}
    </div>
  );
}

Checkout.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  setOrderRequests: PropTypes.func.isRequired,
};

export default Checkout;