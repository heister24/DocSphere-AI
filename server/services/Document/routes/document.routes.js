import express from "express";
import {
  deleteDocument,
  getDocumentById,
  getUserDocuments,
  retrieveDocumentChunks,
  uploadDocument,
} from "../controllers/document.controller.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { documentSchema } from "../validator/document.validator.js";
import { validateDocumentUpload } from "../middlewares/validateDocument.middleware.js";
import { getAiUsage } from "../controllers/usage.controller.js";

const documentRouter = express.Router();

documentRouter.post(
  "/upload-pdf",
  authMiddleware,
  upload.single("document"),
  validateDocumentUpload,
  uploadDocument,
);
documentRouter.post("/retrieve-data", authMiddleware, retrieveDocumentChunks);
documentRouter.get("/getAllDocuments", authMiddleware, getUserDocuments);
documentRouter.get(
  "/getDocument/:id",
  authMiddleware,
  validationMiddleware(documentSchema, "params"),
  getDocumentById,
);
documentRouter.delete(
  "/deleteDocument/:id",
  authMiddleware,
  validationMiddleware(documentSchema, "params"),
  deleteDocument,
);

documentRouter.get("/ai-usage", authMiddleware, getAiUsage);

export default documentRouter;
