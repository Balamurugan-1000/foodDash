import * as bcrypt from "bcryptjs";
import { Context } from "hono";
import Admin from "../models/adminModel";
import { createToken } from "../utils/jwt";
export const loginFunction = async (c: Context) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email)
    return c.json({
      success: false,
      message: "Email is required",
    });

  if (!password)
    return c.json({
      success: false,
      message: "Password is required",
    });

  const user = await Admin.findOne({ email });

  if (!user) {
    return c.json(
      {
        success: false,
        message: "User not found",
      },
      404,
    );
  }

  const isMatch = await bcrypt.compare(password, user.password); // 🔒 bcrypt needs both as strings

  if (!isMatch) {
    return c.json(
      {
        success: false,
        message: "Wrong credentials",
      },
      401, // 🔥 Use 401 for auth failure
    );
  }

  const token = await createToken({ email });

  return c.json(
    {
      success: true,
      message: "Login successful",
      token,
    },
    200, // 🔥 200 OK for successful login
  );
};

export const registerFunction = async (c: Context) => {
  const body = await c.req.json();

  const { email, password, name } = body;
  if (!email)
    return c.json({
      success: false,
      message: "Email is required",
    });

  if (!password)
    return c.json({
      success: false,
      message: "password is required",
    });

  if (!name)
    return c.json({
      success: false,
      message: "Name is required",
    });

  const existedUser = await Admin.findOne({ email });

  if (existedUser?.email == email) {
    return c.json({
      success: false,
      message: "User with this email exist",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Admin.create({ email, name, password: hashedPassword });

  return c.json({
    message: "registeration Successful",
    user,
  });
};
