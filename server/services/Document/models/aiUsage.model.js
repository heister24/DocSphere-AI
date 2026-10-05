import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    requestType: {
      type: String,
      required: true,
      enum: ["RAG_ANSWER"],
    },

    inputTokens: {
      type: Number,
      default: 0,
    },

    outputTokens: {
      type: Number,
      default: 0,
    },

    totalTokens: {
      type: Number,
      default: 0,
    },

    model: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const AiUsage = mongoose.model(
  "AiUsage",
  aiUsageSchema,
);

export default AiUsage;