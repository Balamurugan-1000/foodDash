import { useEffect, useState } from "react";

const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [orderForm, setOrderForm] = useState({
    user_name: "",
    phone: "",
    address: "",
  });
  const [selectedDishes, setSelectedDishes] = useState({});

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dish`);
      const data = await res.json();
      setDishes(data.dishes);
    } catch (err) {
      console.error("Failed to fetch dishes 😓", err);
      setDishes([]);
    }
  };

  const updateQuantity = (id, quantity) => {
    setSelectedDishes((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const food = Object.entries(selectedDishes)
      .filter(([_, quantity]) => quantity > 0)
      .map(([dish, quantity]) => ({
        dish,
        quantity: parseInt(quantity),
      }));

    const count = food.reduce((acc, item) => acc + item.quantity, 0);

    if (!orderForm.user_name || !orderForm.phone || !orderForm.address || food.length === 0) {
      alert("Fill in all fields and select at least one dish! ⚠️");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderForm, count, food }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Unknown error");

      alert("Order placed successfully 🧾✅");
      // Reset everything
      setOrderForm({ user_name: "", phone: "", address: "" });
      setSelectedDishes({});
    } catch (err) {
      console.error("Order failed 💀", err);
      alert("Order failed! Try again 💔");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">🍲 Available Dishes</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {dishes?.map((dish) => (
          <div
            key={dish._id}
            className="border border-gray-200 p-5 rounded-2xl shadow-md bg-white"
          >
            <div className="flex flex-col items-center">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-64 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-xl mb-3 text-gray-400 text-sm">
                  No Image 📷
                </div>
              )}

              <h4 className="text-lg font-semibold text-center text-gray-900">{dish.name}</h4>
              <p className="text-sm text-gray-600 text-center mb-1">{dish.description}</p>
              <p className="text-xl font-bold text-green-600 mb-1">${dish.price}</p>
              <p className="text-sm text-gray-500 mb-2">Available: {dish.count}</p>
              <input
                type="number"
                min="0"
                placeholder="Qty"
                className="w-20 px-2 py-1 border rounded-md text-center"
                value={selectedDishes[dish._id] || ""}
                onChange={(e) => updateQuantity(dish._id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Your Details</h3>
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          value={orderForm.user_name}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={orderForm.phone}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={orderForm.address}
          onChange={handleInputChange}
          className="border p-3 rounded-lg"
        ></textarea>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition"
        >
          🚀 Place Order
        </button>
      </div>
    </div>
  );
};

export default HomePage;

