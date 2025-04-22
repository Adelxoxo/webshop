import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function Cart({ cart, setCart, onCheckout }) {
  const [isCheckoutAnimating, setIsCheckoutAnimating] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      let localCart = localStorage.getItem("cart");
      if (localCart != null) {
        setCart(JSON.parse(localCart));
      }
    }
  }, [cart, setCart]);

  const handleSubmit = () => {
    // Animate button on click
    setIsCheckoutAnimating(true);
    setTimeout(() => setIsCheckoutAnimating(false), 500);
    
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    onCheckout();
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    if (updatedCart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    
    // Dispatch event to update navbar cart count
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { count: updatedCart.length } 
    }));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-lg text-gray-600 mb-6">Your cart is empty.</p>
          <a 
            href="/catalog" 
            className="inline-block bg-slate-700 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items - Takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
              </div>
              
              {/* Cart Items */}
              <div>
                {cart.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 ${index !== cart.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Image & Name */}
                      <div className="col-span-6">
                        <div className="flex items-center space-x-4">
                          <img
                            className="w-16 h-16 object-cover rounded-md"
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.name}
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 text-center">
                        ${parseFloat(item.price).toFixed(2)}
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <span className="text-gray-600">-</span>
                          </button>
                          <span className="mx-2 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <span className="text-gray-600">+</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Total & Remove Button */}
                      <div className="col-span-2">
                        <div className="flex flex-col items-center space-y-2">
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary - Takes up 1/3 of the space on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                className={`w-full bg-slate-700 text-white py-3 rounded-md font-medium transition-all ${
                  isCheckoutAnimating ? 'animate-pulse bg-green-600' : 'hover:bg-slate-800'
                }`}
              >
                {isCheckoutAnimating ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <a 
                href="/catalog" 
                className="block text-center mt-4 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Cart.propTypes = {
  cart: PropTypes.array.isRequired,
  setCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
};

export default Cart;