import { Context } from "hono";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = async (c: Context, next: Function) => {
  const authHeader = c.req.header("Authorization");

  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return c.json({
      success: false,
      message: "Error UnAuthorized or No token",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const { email } = await verifyToken(token, c);

    c.set("user", email);

    await next();
  } catch (error) {
    console.error(error);

    return c.json({
      success: false,
      message: "Expired token or invalid token",
    });
  }
};
