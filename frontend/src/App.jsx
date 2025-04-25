import "./App.css";
import Login from "./components/admin/Login";
import AdminPage from "./components/admin/AdminPage";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar"; // 🍔 Import the Navbar
import AdminMenu from "./components/admin/AdminMenu";
import UserOrderPage from "./components/UserOrderPage";
import MyOrders from "./components/MyOrders";

// 🛡️ PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 👀 Wrapper to conditionally show Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ["/login"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/order" element={<UserOrderPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <AdminMenu />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
