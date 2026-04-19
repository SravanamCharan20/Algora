import express from "express";
import { z } from "zod";
import User from "../models/User.js";
import {
  clearCookieOptions,
  cookieOptions,
  createToken,
  requireAuth,
} from "../middleware/auth.js";

const router = express.Router();

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
  role: z.enum(["user", "admin"]).default("user"),
});

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = createToken(user._id.toString());
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.status(statusCode).json({
    message: statusCode === 201 ? "Account created successfully." : "Signed in successfully.",
    user,
  });
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

    const user = await User.create({ name, email, password, role: "user" });
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

    const { email, password, role } = parsedBody.data;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message:
          role === "admin"
            ? "This account does not have admin access."
            : "Use the admin sign-in for this account.",
      });
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
