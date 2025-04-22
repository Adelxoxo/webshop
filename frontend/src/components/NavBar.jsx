import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [userType, setUserType] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  useEffect(() => {
    console.log("Toolbar hi from useEffect");
    setUserType(localStorage.getItem('userType') || null);
    
    // Get initial cart count from localStorage if available
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItemCount(savedCart.length);
    
    // Listen for storage events for login/logout
    window.addEventListener('storage', storageEventHandler, false);
    
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', storageEventHandler);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  function handleCartUpdate(e) {
    const newCount = e.detail ? e.detail.count : 0;
    setCartItemCount(newCount);
    
    // Trigger animation
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);
  }

  function storageEventHandler() {
    console.log("hi from storageEventHandler");
    setUserType(localStorage.getItem('userType') || null);
  }

  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Left side navigation links */}
        <ul className="flex space-x-4">
          <li className="hover:opacity-70 hover:duration-200"><Link to="/">Home</Link></li>
          <li className="hover:opacity-70 hover:duration-200"><Link to="/catalog">Catalog</Link></li>
          {userType === "ADMIN" && <li className="hover:opacity-70 hover:duration-200"><Link to="/admin">Admin</Link></li>}
        </ul>

        {/* Right side navigation links */}
        <ul className="flex space-x-4 items-center">
          {userType && <li className="hover:opacity-70 hover:duration-200"><Link to="/logout">Log out</Link></li>}
          {!userType && <li className="hover:opacity-70 hover:duration-200"><Link to="/login">Login</Link></li>}
          <li className="relative">
            <Link 
              to="/cart" 
              className={`flex items-center ${isCartAnimating ? 'animate-bounce' : ''}`}
            >
              Cart
              {cartItemCount > 0 && (
                <span className={`ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${isCartAnimating ? 'animate-pulse' : ''}`}>
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;