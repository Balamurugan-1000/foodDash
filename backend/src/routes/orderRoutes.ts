import { Hono } from "hono";
import {
  orderAFood,
  getAllOrders,
  updateOrderStatus,
  getAFood,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

export const order = new Hono();

order.post("/", (c) => orderAFood(c));
order.get("/:phone",(c) => getAFood(c));
order.use("*", authMiddleware);

order.get("/", (c) => getAllOrders(c));
order.put("/:id", (c) => updateOrderStatus(c));
