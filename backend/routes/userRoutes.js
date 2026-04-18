import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRECT;
const COOKIE_NAME = "algora_token";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60;
const isProduction = process.env.NODE_ENV === "production";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long."),
});

const signinSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: TOKEN_EXPIRY * 1000,
  path: "/",
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const createToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = createToken(user._id.toString());
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(statusCode).json({
    message: statusCode === 201 ? "Account created successfully." : "Signed in successfully.",
    user,
  });
};

const getTokenFromRequest = (req) => req.cookies?.[COOKIE_NAME];

const requireAuth = async (req, res, next) => {
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

router.post("/signup", async (req, res) => {
  try {
    const parsedBody = signupSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: parsedBody.error.issues[0]?.message || "Invalid signup data.",
      });
    }

    const { name, email, password } = parsedBody.data;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password });
    return sendAuthResponse(res, user, 201);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Could not create your account right now.",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const parsedBody = signinSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: parsedBody.error.issues[0]?.message || "Invalid login data.",
      });
    }

    const { email, password } = parsedBody.data;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.password = undefined;
    return sendAuthResponse(res, user);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Could not sign you in right now.",
    });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.status(200).json({
    message: "Authenticated user loaded successfully.",
    user: req.user,
  });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions);
  res.status(200).json({ message: "Signed out successfully." });
});

export default router;
