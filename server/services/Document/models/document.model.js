import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "UPLOADED",
    },
    errorMsg: {
      type: String,
      default: null,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    totalChunks: {
      type: Number,
      default: 0,
    },
    qdrantCollection: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
