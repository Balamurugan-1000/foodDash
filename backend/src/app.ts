import { Hono } from "hono";
import { cors } from "hono/cors"; // ✅ fixed path
import { connectDb } from "./config/db";
import { auth } from "./routes/authRoutes";
import { dish } from "./routes/dishRoutes";
import { order } from "./routes/orderRoutes";

const app = new Hono(); // ❌ don't export here, we'll do it after setup

// 💥 Apply CORS middleware
app.use(
  "*",
  cors({
    origin: "*", // 🔥 use specific domain in prod (like http://localhost:5173)
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ DB connect (try/catch not needed if connectDb handles errors)
connectDb();

app.route("/api", auth);
app.route("/api/dish", dish);
app.route("/api/orders", order);
// ✅ Now export
export default app;
