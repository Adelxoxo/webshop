import PropTypes from "prop-types";
import { useState } from "react";

function ProductCard({ product, onAddToCart, onProductClick }) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking "Buy"
    
    // Trigger button animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    // Add item to cart
    onAddToCart(product);
    
    // Dispatch custom event to update cart count in navbar
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { count: cart.length + 1 } 
    }));
  };

  return (
    <div
      className="flex flex-col justify-between rounded-md border border-gray-300 h-64 md:h-80 lg:h-96 w-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onProductClick(product.id)} // Navigate to the item's page
    >
      {/* Image with responsive height */}
      <div className="w-full h-32 md:h-36 lg:h-44 overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-t-md"
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
        />
      </div>

      {/* Content section */}
      <div className="p-2 md:p-3 lg:p-4 flex-grow">
        <p className="text-sm md:text-base lg:text-lg font-bold truncate">{product.name}</p>
        <p className="text-xs md:text-sm opacity-70">{product.category}</p>
        <p className="text-xs opacity-50 line-clamp-2 md:line-clamp-3" title={product.description}>
          {product.description}
        </p>
      </div>

      {/* Footer with price and button */}
      <div className="p-2 md:p-3 lg:p-4 flex justify-between items-center border-t border-gray-100">
        <p className="text-sm md:text-base font-bold">{product.price} KM</p>
        <button
          className={`py-1 px-2 md:px-3 lg:px-4 text-xs md:text-sm rounded-md bg-slate-700 text-white cursor-pointer hover:bg-slate-800 transition-colors duration-200 ${isAnimating ? 'animate-pulse scale-105' : ''}`}
          onClick={handleAddToCart}
        >
          {isAnimating ? 'Added!' : 'Buy'}
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onProductClick: PropTypes.func.isRequired,
};

export default ProductCard;