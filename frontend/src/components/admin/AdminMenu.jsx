import { useEffect, useState } from "react";

const AdminMenu = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders 😓", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, readyStatus) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ready: readyStatus }),
        },
      );

      const result = await res.json();
      if (res.ok) {
        const updatedOrder = result.order;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order,
          ),
        );
      } else {
        console.error("Failed to update order status 😓", result.message);
      }
    } catch (error) {
      console.error("Error updating order status 😓", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg mt-10">Loading orders... ⏳</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Orders 🍽️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className={`p-4 rounded-lg shadow-md transition-all border-2 ${order.ready
              ? "border-green-500 bg-green-50"
              : "border-gray-200 bg-white"
              }`}
          >
            <h2 className="text-xl font-semibold mb-1">{order.user_name}</h2>
            <p className="text-gray-600 text-sm">📞 {order.phone}</p>
            <p className="text-gray-600  text-sm">🏠 {order.address}</p>
            <p className="font-semibold mt-2 text-md">
              🧾 Count: {order.count}
            </p>

            <div className="mt-3">
              <h3 className="text-md font-semibold mb-1">Dishes 🍜:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {order.food.map((item) => (
                  <li key={item.dish._id}>
                    {item.dish.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold">Status:</h3>
              <p
                className={`font-semibold ${order.ready ? "text-green-600" : "text-red-600"
                  }`}
              >
                {order.ready ? "✅ Ready" : "❌ Not Ready"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded font-semibold text-white transition-colors ${order.ready
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
                onClick={() => handleStatusUpdate(order._id, true)}
                disabled={order.ready}
              >
                Mark as Ready
              </button>
              <button
                className={`px-4 py-2 rounded font-semibold text-white transition-colors ${!order.ready
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
                  }`}
                onClick={() => handleStatusUpdate(order._id, false)}
                disabled={!order.ready}
              >
                Mark as Not Ready
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
