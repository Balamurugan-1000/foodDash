import { Context } from "hono";
import Dish from "../models/dishModel";

export const createDish = async (c: Context) => {
  const body = await c.req.json();

  const { name, image, description, count, price } = body;

  if (!name)
    return c.json({
      success: false,
      message: "Name required",
    });

  if (!image)
    return c.json({
      success: false,
      message: "image required",
    });
  if (!description)
    return c.json({
      success: false,
      message: "description required",
    });
  if (!count)
    return c.json({
      success: false,
      message: "Count is required",
    });

  if (!price)
    return c.json({
      success: false,
      message: "price is required",
    });

  try {
    const dish = await Dish.create({ name, count, description, price, image });
    return c.json({ success: true, message: "Dish is created", dish });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, message: "Failed to create dish" }, 500);
  }
};

export const getAllDish = async (c: Context) => {
  const dishes = await Dish.find();

  return c.json({
    success: true,
    dishes,
  });
};

export const updateDish = async (c: Context) => {
  const id = c.req.param("id");

  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ success: false, message: "Invalid JSON body" }, 400);
  }

  const { name, image, description, count, price } = body;

  const dish = await Dish.findById(id);

  if (!dish) {
    return c.json({ success: false, message: "Dish not found" }, 404);
  }

  // Safer assignments
  dish.name = name ?? dish.name;
  dish.image = image ?? dish.image;
  dish.description = description ?? dish.description;
  dish.count = count ?? dish.count;
  dish.price = price ?? dish.price;

  try {
    await dish.save();
    return c.json({ success: true, message: "Dish is updated" });
  } catch (err) {
    console.error("Update error 👉", err);
    return c.json({ success: false, message: "Failed to update dish" }, 500);
  }
};

export const deleteDish = async (c: Context) => {
  const id = c.req.param("id");
  const dish = await Dish.findByIdAndDelete(id);

  return c.json({
    success: true,
    message: "Dish deleted successfully",
    dish,
  });
};
