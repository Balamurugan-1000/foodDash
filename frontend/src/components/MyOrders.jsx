import { useEffect, useState } from "react";

const MyOrders = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckOrders = async () => {
    if (!phone) {
      alert("📱 Please enter your phone number!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${phone}`);
      const data = await res.json();
      console.log(data)

      if (!res.ok) throw new Error(data.message || "Something went wrong ❌");

      setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders 💔", err);
      setError(err.message || "Unknown error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">📦 My Orders</h3>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        />
        <button
          onClick={handleCheckOrders}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          🔍 Check Orders
        </button>
      </div>

      {loading && <p>⏳ Loading your orders...</p>}
      {error && <p className="text-red-600">❗ {error}</p>}

      {orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-xl shadow bg-white"
            >
              <h4 className="font-semibold text-lg text-gray-700">
                📄 Order ID: <span className="text-gray-900">{order._id}</span>
              </h4>
              <p className="text-gray-600">Name: {order.user_name}</p>
              <p className="text-gray-600">Address: {order.address}</p>
              <p className="text-gray-600">Total Items: {order.count}</p>
              <p className="text-gray-600">
                Status: {order.ready ? "✅ Ready" : "🕐 Not Ready"}
              </p>
              <div className="mt-2">
                <p className="font-semibold mb-1">🍽️ Dishes Ordered:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {order.food.map((item) => (
                    <li key={item._id}>
                      <div>
                        <strong>{item.dish.name}</strong> (ID: {item.dish._id}) 
                        - {item.quantity} × ${item.dish.price} 
                        <br />
                        <span className="text-gray-500">{item.dish.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-500">No orders found for this number.</p>
      )}
    </div>
  );
};

export default MyOrders;

