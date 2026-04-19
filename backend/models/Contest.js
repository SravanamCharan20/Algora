import mongoose from "mongoose";

const contestProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    prompt: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    points: {
      type: Number,
      min: 1,
      max: 10000,
      default: 100,
    },
  },
  {
    _id: true,
  }
);

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    problems: {
      type: [contestProblemSchema],
      validate(value) {
        if (!value.length) {
          throw new Error("A contest needs at least one problem.");
        }
      },
    },
    status: {
      type: String,
      enum: ["draft", "live", "stopped"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    stoppedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contestSchema.methods.toJSON = function removeInternalFields() {
  const contest = this.toObject();
  delete contest.__v;
  return contest;
};

const Contest = mongoose.models.Contest || mongoose.model("Contest", contestSchema);

export default Contest;
