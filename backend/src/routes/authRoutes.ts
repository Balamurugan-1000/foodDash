import { Context, Hono } from "hono";
import { loginFunction, registerFunction } from "../controllers/authController";


export const auth = new Hono();

auth.post("/login" ,async (c) =>  loginFunction(c))

auth.post("/register" , async(c) =>  await registerFunction(c))

