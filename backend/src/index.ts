import app from "./app";

Bun.serve({
  fetch: app.fetch,
  port: 5000,
  hostname: "0.0.0.0", // 🔥 important for CORS to work with Vite
});
