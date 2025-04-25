import { useEffect, useState } from "react";

const UserOrderPage = () => {
  const [dishes, setDishes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [form, setForm] = useState({
    user_name: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDishes();
    loadLocalOrders();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dish`);
      const data = await res.json();
      setDishes(data.dishes || []);
    } catch (error) {
      console.error("Error fetching dishes 😓", error);
    }
  };

  const loadLocalOrders = async () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = await Promise.all(
      storedOrders.map(async (order) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          return data.order;
        } catch (err) {
          console.error("Error fetching order status 😢", err);
          return order;
        }
      })
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleAddDish = (dishId) => {
    const existing = selectedItems.find((item) => item.dish === dishId);
    if (existing) {
      const updated = selectedItems.map((item) =>
        item.dish === dishId ? { ...item, quantity: item.quantity + 1 } : item
      );
      setSelectedItems(updated);
    } else {
      setSelectedItems([...selectedItems, { dish: dishId, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (dishId, qty) => {
    const updated = selectedItems.map((item) =>
      item.dish === dishId ? { ...item, quantity: qty } : item
    );
    setSelectedItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          count: totalCount,
          food: selectedItems,
        }),
      });

      const data = await res.json();
      console.log("Order placed ✅", data);
      alert("Order placed successfully 🎉");

      const previousOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrders = [...previousOrders, data.order];
      localStorage.setItem("orders", JSON.stringify(newOrders));
      setOrders(newOrders);

      // Reset form
      setForm({ user_name: "", phone: "", address: "" });
      setSelectedItems([]);
    } catch (err) {
      console.error("Failed to place order 😢", err);
      alert("Something went wrong while placing the order 💀");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Place an Order 🧾</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded w-full"
            value={form.user_name}
            onChange={(e) => setForm({ ...form, user_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 rounded w-full"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <textarea
          placeholder="Address"
          className="border p-2 rounded w-full"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />

        <div>
          <h3 className="text-lg font-semibold mb-2">Select Dishes 🍛</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dishes.map((dish) => (
              <div
                key={dish._id}
                className="border rounded p-3 bg-gray-50 shadow-sm"
              >
                <h4 className="font-bold">{dish.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{dish.description}</p>
                <p className="text-sm text-gray-700">₹ {dish.price}</p>

                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleAddDish(dish._id)}
                >
                  Add Dish ➕
                </button>

                {selectedItems.find((item) => item.dish === dish._id) && (
                  <input
                    type="number"
                    className="mt-2 w-full border px-2 py-1 rounded"
                    min={1}
                    value={
                      selectedItems.find((item) => item.dish === dish._id)
                        ?.quantity || 1
                    }
                    onChange={(e) =>
                      handleQuantityChange(dish._id, Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
        >
          Submit Order ✅
        </button>
      </form>

      {/* Order History */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Your Previous Orders 🗃️</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet 😶</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order._id}
                className="border p-3 rounded bg-white shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="font-semibold">
                    {order.user_name} - {order.count} items
                  </p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
                <span className="text-xs mt-2 sm:mt-0 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  #{order._id.slice(-6)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserOrderPage;
