import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed ");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#02102a]">
      <div className="min-h-[400px] min-w-[300px] lg:w-[500px] rounded-2xl lg:h-[500px] flex items-center justify-center border border-white p-8">
        <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
          <h2 className="text-center text-3xl font-semibold text-white mb-6">
            Login
          </h2>

          <span className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white text-lg">
              Email
            </label>
            <input
              type="email"
              className="bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email"
            />
          </span>

          <span className="flex flex-col gap-2 mt-4">
            <label htmlFor="password" className="text-white text-lg">
              Password
            </label>
            <input
              type="password"
              className="bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Enter your password"
            />
          </span>

          <button
            type="submit"
            className="mt-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
