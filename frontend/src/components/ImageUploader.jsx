import { useState } from "react";
import supabase from "../utils/supabase"; // Import supabase config

const AddDish = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");

  // Handle the file upload to Supabase
  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}-${file.name}`; // Use a unique name for the image
    const { data, error } = await supabase.storage
      .from("dish-images")
      .upload(fileName, file);

    if (error) {
      console.error("Image upload failed 😓", error.message);
      return null;
    }

    // Return the URL of the uploaded image
    const imageUrl = `${supabase.storage.from("dish-images").getPublicUrl(fileName).publicURL}`;
    return imageUrl;
  };

  // Handle dish creation
  const handleDishCreate = async (e) => {
    e.preventDefault();

    if (!name || !description || !image || !price || !count) {
      alert("All fields are required!");
      return;
    }

    try {
      const imageUrl = await handleImageUpload(image);

      if (imageUrl) {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/dish`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name,
              description,
              price,
              count,
              image: imageUrl, // Send the uploaded image URL to the backend
            }),
          },
        );

        const data = await res.json();
        console.log("Dish added:", data);
      }
    } catch (error) {
      console.error("Failed to add dish 😓", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleDishCreate}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Count:
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            required
          />
        </label>

        <label>
          Image:
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </label>

        <button type="submit">Add Dish</button>
      </form>
    </div>
  );
};

export default AddDish;
