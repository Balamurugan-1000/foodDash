import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createDish,
  deleteDish,
  getAllDish,
  updateDish,
} from "../controllers/dishController";

export const dish = new Hono();

dish.get("/", (c) => {
  return getAllDish(c);
});
dish.use("*", authMiddleware);

dish.post("/", (c) => {
  return createDish(c);
});
dish.patch("/:id", (c) => updateDish(c));

dish.delete("/:id", (c) => deleteDish(c));
