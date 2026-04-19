import express from "express";
import { z } from "zod";
import Contest from "../models/Contest.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();

const problemSchema = z.object({
  title: z.string().trim().min(2, "Problem title must be at least 2 characters."),
  prompt: z.string().trim().max(2000, "Problem prompt is too long.").optional().default(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Medium"),
  points: z.coerce
    .number()
    .int("Points must be a whole number.")
    .min(1, "Points must be at least 1.")
    .max(10000, "Points are too high."),
});

const contestSchema = z.object({
  title: z.string().trim().min(3, "Contest title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .max(300, "Description is too long.")
    .optional()
    .default(""),
  problems: z
    .array(problemSchema)
    .min(1, "Add at least one problem to the contest.")
    .max(10, "Keep contests to 10 problems or fewer."),
});

const parseContestPayload = (body) => {
  const parsedBody = contestSchema.safeParse(body);

  if (!parsedBody.success) {
    return {
      error: parsedBody.error.issues[0]?.message || "Invalid contest data.",
    };
  }

  return {
    data: parsedBody.data,
  };
};

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { status: "live" };
    const contests = await Contest.find(filter).sort({
      status: 1,
      updatedAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      contests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Could not load contests right now.",
    });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const parsed = parseContestPayload(req.body);

    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const contest = await Contest.create({
      ...parsed.data,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Contest created successfully.",
      contest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Could not create the contest right now.",
    });
  }
});

router.patch("/:contestId", requireAdmin, async (req, res) => {
  try {
    const parsed = parseContestPayload(req.body);

    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const contest = await Contest.findByIdAndUpdate(req.params.contestId, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }

    res.status(200).json({
      message: "Contest updated successfully.",
      contest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Could not update the contest right now.",
    });
  }
});

router.post("/:contestId/start", requireAdmin, async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.contestId,
      {
        status: "live",
        startedAt: new Date(),
        stoppedAt: null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }

    res.status(200).json({
      message: "Contest started successfully.",
      contest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Could not start the contest right now.",
    });
  }
});

router.post("/:contestId/stop", requireAdmin, async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.contestId,
      {
        status: "stopped",
        stoppedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }

    res.status(200).json({
      message: "Contest stopped successfully.",
      contest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Could not stop the contest right now.",
    });
  }
});

export default router;
