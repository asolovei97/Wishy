import { Request, Response, NextFunction } from "express";
import { verifyToken, generateToken } from "../lib/auth";
import { DateTime } from "luxon";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;

  // Fallback to headers if needed (though we want to move to cookies)
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    // Automatic token renewal: refresh the cookie on every request if valid
    const newToken = generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    res.cookie("jwt", newToken, {
      expires: DateTime.now().plus({ hours: 72 }).toJSDate(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    });

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

export const protect = authenticate;
