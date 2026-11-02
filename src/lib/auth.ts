import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const COOKIE = "mca_token";
const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set in .env.local");
  return s;
};

export type TokenPayload = { sub: string; registerNumber: string };

export const signToken = (p: TokenPayload) => jwt.sign(p, secret(), { expiresIn: "7d" });

export async function getSession(): Promise<TokenPayload | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try { return jwt.verify(token, secret()) as TokenPayload; } catch { return null; }
}
