import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    }
  };

  return (
    <div className="login-container">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form ">
        <fieldset className="flex gap-y-2 flex-col mb-4 border border-gray-200 px-4 py-2 rounded max-w-80">
          <legend className="text-sm px-2">Username</legend>
          <input
            className="border-none focus:outline-none px-2"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </fieldset>
        <fieldset className="flex gap-y-2 flex-col mb-4 border border-gray-200 px-4 py-2 rounded max-w-80">
          <legend className="text-sm px-2">Password</legend>
          <input
            className="border-none focus:outline-none px-2"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </fieldset>
        <button
          type="submit"
          className="px-4 py-2 rounded-md border-2 bg-blue-500 text-white border-blue-500 hover:shadow-lg transition-shadow duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
