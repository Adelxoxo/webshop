import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        
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
              value={formData.username}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-slate-700"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block font-bold mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-slate-700"
              placeholder="Enter your email address"
            />
          </div>
          
          <div>
            <label className="block font-bold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-slate-700"
              placeholder="Create a password"
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
              {isSubmitting ? "Processing..." : "Register"}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-slate-700 hover:underline font-medium">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;