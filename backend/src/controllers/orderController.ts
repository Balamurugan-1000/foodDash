import { Context } from "hono";
import Order from "../models/orderModel";

export const orderAFood = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { user_name, phone, address, count, food } = body;

    // Basic validation 🛡️
    if (
      !user_name ||
      !phone ||
      !address ||
      !count ||

      !Array.isArray(food) ||
      food.length === 0
    ) {
      return c.json({ message: "Missing required fields" }, 400);
    }

    // Optional: validate each dish entry
    for (const item of food) {
      if (!item.dish || !item.quantity) {
        return c.json({ message: "Invalid food item format" }, 400);
      }
    }

    const newOrder = await Order.create({
      user_name,
      phone,
      address,
      count,
      food,
    });

    return c.json(
      {
        message: "Order placed successfully 🧾✅",
        order: newOrder,
      },
      201,
    );
  } catch (error) {
    console.error("Failed to place order ❌", error);
    return c.json({ message: "Something went wrong!" }, 500);
  }
};

export const getAllOrders = async (c: Context) => {
  try {
    const orders = await Order.find().populate("food.dish");

    return c.json(
      {
        message: "All orders fetched 🧾📦",
        orders,
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching orders ❌", error);
    return c.json({ message: "Failed to get orders" }, 500);
  }
};

export const updateOrderStatus = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { ready } = body;

    if (typeof ready !== "boolean") {
      return c.json({ message: "Invalid 'ready' status" }, 400);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ready },
      { new: true },
    ).populate("food.dish");

    if (!updatedOrder) {
      return c.json({ message: "Order not found 🕵️‍♂️" }, 404);
    }

    return c.json(
      {
        message: "Order status updated ✅",
        order: updatedOrder,
      },
      200,
    );
  } catch (error) {
    console.error("Failed to update order 😵", error);
    return c.json({ message: "Error updating order" }, 500);
  }
};

export const getAFood =async(c : Context) => {

    const { phone } = c.req.param();

  const orders = await Order.find({phone}).populate("food.dish")

  if(!orders) return c.json({
    success : false,
    message : "No orders found"
  })

  return c.json({
    success : true,
    orders
  })


}
