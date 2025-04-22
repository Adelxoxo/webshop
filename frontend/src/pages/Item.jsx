import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Item({ cart, setCart }) {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${itemId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [itemId]);

  const addToCart = () => {
    // Start animation
    setIsAnimating(true);
    
    // Add to cart logic
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((cartItem) => cartItem.id === product.id);

    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    
    // Dispatch event to update navbar cart count with animation
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { count: updatedCart.length } 
    }));
    
    // Reset animation after 500ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">Price: ${product.price}</p>
          <p className="text-gray-600 mt-2">{product.description}</p>
          {product.speed && (
            <p className="text-gray-600 mt-2">
              <strong>Speed:</strong> {product.speed}
            </p>
          )}
          {product.memory && (
            <p className="text-gray-600 mt-2">
              <strong>Memory:</strong> {product.memory}
            </p>
          )}
          {product.power && (
            <p className="text-gray-600 mt-2">
              <strong>Power:</strong> {product.power}
            </p>
          )}
          <button
            className={`bg-blue-600 text-white px-6 py-2 mt-4 rounded-lg shadow transition-all duration-200 ${
              isAnimating 
                ? 'animate-pulse bg-green-600 scale-105 transform' 
                : 'hover:bg-blue-700'
            }`}
            onClick={addToCart}
          >
            {isAnimating ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 mt-4 ml-4 rounded-lg shadow hover:bg-green-700"
            onClick={handleShare}
          >
            Share this item
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;