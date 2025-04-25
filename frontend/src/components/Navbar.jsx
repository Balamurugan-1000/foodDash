import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token); // If token exists, we treat as admin
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // 🛑 Hide navbar on login page
  if (location.pathname === "/login") return null;

  return (
    <nav className="w-full px-8 py-4 bg-[#0e1d35] text-white flex justify-between items-center shadow-md">
      <Link to={"/"}>

      <h1 className="text-xl font-bold">🍽️ FoodDash</h1>

      </Link>
      <div className="flex items-center gap-6 text-lg">
        {/* 👥 Everyone can see Menu */}
        <Link to="/" className="hover:text-yellow-400 transition">
         Home        </Link>
        {
!isAdmin && (
        <Link to="/my-orders" className="hover:text-yellow-400 transition">
          My Orders
        </Link>
          )

        }
        {/* 🧑‍🍳 Admin-only Links */}
        {isAdmin && (
          <>
            <Link to="/dashboard" className="hover:text-yellow-400 transition">
              Add Dish
            </Link>
            <Link to="/orders" className="hover:text-yellow-400 transition">
              Orders
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg transition"
            >
              Logout
            </button>
          </>
        )}

        {/* 👥 If not logged in, show login (but only if not on dashboard/orders) */}
        {!isAdmin && location.pathname !== "/login" && <></>}
      </div>
    </nav>
  );
};

export default Navbar;
