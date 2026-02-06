import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const generateToken = (payload: { userId: string; email: string; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "72h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
