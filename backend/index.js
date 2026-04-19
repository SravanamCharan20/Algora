import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import contestRoutes from "./routes/contestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { ensureAdminUser } from "./utils/bootstrapAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Algora auth server is healthy." });
});

app.use("/api/auth", userRoutes);
app.use("/api/contests", contestRoutes);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected !!");
    await ensureAdminUser();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to connect DB:", error.message);
    process.exit(1);
  }
};

startServer();
