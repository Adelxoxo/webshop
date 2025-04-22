import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Item from "./pages/Item";
import CheckoutModal from "./components/CheckoutModal";
import Login from "./pages/Login";
import { Logout } from "./pages/Logout";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart
      ? JSON.parse(savedCart).map((item) => ({
          ...item,
          id: Number(item.id), // Ensure id is a number
        }))
      : [];
  });
  
  const [orderRequests, setOrderRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Dispatch event to notify other components of cart update
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { count: cart.length } 
    }));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Function to add item to cart (to be passed to components)
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) => Number(item.id) === Number(product.id) // Ensure id is compared as a number
      );
  
      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity =
          (updatedCart[existingItemIndex].quantity || 1) + 1;
        return updatedCart;
      } else {
        // Otherwise add new item with quantity 1
        return [
          ...prevCart,
          { ...product, id: Number(product.id), quantity: 1 }, // Ensure id is stored as a number
        ];
      }
    });
  };

  return (
    <Router>
      <NavBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/catalog"
            element={<Catalog cart={cart} setCart={setCart} addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                onCheckout={() => setIsModalVisible(true)}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <Admin
                orderRequests={orderRequests}
                products={products}
                setProducts={setProducts}
              />
            }
          />
          <Route
            path="/item/:itemId"
            element={<Item cart={cart} setCart={setCart} addToCart={addToCart} />}
          />
        </Routes>
        <CheckoutModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          cart={cart}
          setOrderRequests={setOrderRequests}
          clearCart={clearCart}
        />
      </div>
    </Router>
  );
}

export default App;