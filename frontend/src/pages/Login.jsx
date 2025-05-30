import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await response.json();
      // Save token and any user details (if needed) in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userType", data.type);
      window.dispatchEvent(new Event("storage"));

      // Navigate to the admin panel or home page based on user type
      if (data.type === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-slate-700"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block font-bold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-slate-700"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-2 rounded-md text-white font-medium ${
                isSubmitting ? "bg-green-600 animate-pulse" : "bg-slate-700 hover:bg-slate-800"
              } transition-colors`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-slate-700 hover:underline font-medium">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;