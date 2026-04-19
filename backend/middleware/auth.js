import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRECT;
const COOKIE_NAME = "algora_token";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60;
const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: TOKEN_EXPIRY * 1000,
  path: "/",
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export const createToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};

const getTokenFromRequest = (req) => req.cookies?.[COOKIE_NAME];

export const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Please sign in again." });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required." });
  }

  next();
};
