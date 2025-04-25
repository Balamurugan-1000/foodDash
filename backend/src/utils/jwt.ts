import { Context } from "hono";
import { sign, verify } from "hono/jwt";
export const createToken = async (payload: any) => {
    const token = await sign(payload, process.env.JWT_SECRET as string);

    return token;
};

export const verifyToken = async (token: string, c: Context) => {
    const valid = await verify(token, process.env.JWT_SECRET as string);

    return valid;
};
