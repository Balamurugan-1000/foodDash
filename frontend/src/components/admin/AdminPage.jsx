import { useState, useEffect } from "react";
import supabase from "../../utils/supabase"; // Import Supabase configuration

const AdminPage = () => {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    description: "",
    count: "",
    image: null,
  });
  const [editingDish, setEditingDish] = useState(null); // For editing dishes

  const token = localStorage.getItem("token"); // Get the token from localStorage
  // Fetch dishes when component loads
  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dish`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the request header
        },
      });

      const data = await res.json();

      console.log(data);
      setDishes(data.dishes);
    } catch (err) {
      console.error("Failed to fetch dishes 😓", err);
      setDishes([]); // Handle errors gracefully by setting an empty array
    }
  };

  // Handle the image upload to Supabase
  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}-${file.name}`; // Use a unique name for the image
    const { error } = await supabase.storage
      .from("dish-images")
      .upload(fileName, file);

    if (error) {
      console.error("Image upload failed 😓", error.message);
      return null;
    }

    // Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from("dish-images")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl; // Correct property is `publicUrl`
    console.log(imageUrl);

    return imageUrl;
  };
  const handleAddDish = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = newDish.image
        ? await handleImageUpload(newDish.image)
        : null;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the request header
        },
        body: JSON.stringify({
          ...newDish,
          image: imageUrl, // Attach the image URL if available
        }),
      });

      if (res.ok) {
        fetchDishes(); // Refresh dish list
        setNewDish({
          name: "",
          price: "",
          description: "",
          count: "",
          image: null,
        }); // Clear form
        alert("Dish added successfully! 🍽️");
      } else {
        alert("Failed to add dish 😓");
      }
    } catch (err) {
      console.error("Error adding dish", err);
    }
  };

  const handleUpdateDish = async (e) => {
    e.preventDefault();

    try {
      // ⏫ Handle image upload conditionally
      const imageUrl =
        editingDish.image && editingDish.image !== editingDish.prevImage
          ? await handleImageUpload(editingDish.image)
          : editingDish.prevImage;

      // 🧼 Prepare the update payload safely
      const { _id, ...rest } = editingDish;
      const payload = { ...rest, image: imageUrl };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dish/${_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        fetchDishes(); // ✅ Refresh
        setEditingDish(null); // ✅ Clear form
        alert("Dish updated successfully! 🍽️✨");
      } else {
        const errorData = await res.json();
        alert(`Failed to update dish 😓\n${errorData.message}`);
      }
    } catch (err) {
      console.error("Error updating dish ❌", err);
      alert("Something went wrong! 😵‍💫");
    }
  };

  const handleEdit = (dish) => {
    setEditingDish({
      ...dish,
      prevImage: dish.image, // Store the previous image URL for comparison
    });
  };
  const handleDelete = async (dish) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dish/${dish._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(res);
    fetchDishes();
  };
  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard: Dishes</h2>

      {/* Add Dish Form */}
      <form className="mb-8" onSubmit={handleAddDish}>
        <h3 className="text-xl mb-2">Add New Dish</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Dish Name"
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newDish.description}
            onChange={(e) =>
              setNewDish({ ...newDish, description: e.target.value })
            }
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Available Count"
            value={newDish.count}
            onChange={(e) => setNewDish({ ...newDish, count: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="file"
            onChange={(e) =>
              setNewDish({ ...newDish, image: e.target.files[0] })
            }
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
          >
            Add Dish
          </button>
        </div>
      </form>

      {/* Edit Dish Form */}
      {editingDish && (
        <form className="mb-8" onSubmit={handleUpdateDish}>
          <h3 className="text-xl mb-2">Edit Dish</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={editingDish.name}
              onChange={(e) =>
                setEditingDish({ ...editingDish, name: e.target.value })
              }
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={editingDish.price}
              onChange={(e) =>
                setEditingDish({ ...editingDish, price: e.target.value })
              }
              required
              className="p-2 border rounded"
            />
            <textarea
              value={editingDish.description}
              onChange={(e) =>
                setEditingDish({ ...editingDish, description: e.target.value })
              }
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={editingDish.count}
              onChange={(e) =>
                setEditingDish({ ...editingDish, count: e.target.value })
              }
              required
              className="p-2 border rounded"
            />
            <input
              type="file"
              onChange={(e) =>
                setEditingDish({ ...editingDish, image: e.target.files[0] })
              }
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 rounded mt-4 hover:bg-yellow-600"
            >
              Update Dish
            </button>
          </div>
        </form>
      )}

      {/* Dishes List */}
      <h3 className="text-xl mb-2">Available Dishes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dishes?.map((dish) => (
          <div key={dish._id} className="border p-4 rounded shadow-lg bg-white">
            <h4 className="text-lg font-semibold">{dish.name}</h4>
            <p className="text-gray-600">{dish.description}</p>
            <p className="font-bold text-xl">${dish.price}</p>
            <p className="text-gray-500">Available: {dish.count}</p>
            {dish.image ? (
              <img
                src={dish.image}
                alt={dish.name}
                className="mt-1 w-40 h-40 sm:w-48 sm:h-48 object-cover rounded"
              />
            ) : (
              <div className="mt-1 w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-gray-499">No Image</span>
              </div>
            )}

            <button
              onClick={() => handleEdit(dish)}
              className="mt-3 bg-yellow-500 mr-10 text-white py-1 px-3 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(dish)}
              className="mt-3 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}{" "}
      </div>
    </div>
  );
};

export default AdminPage;
