import express from "express";
import {
  retrieveDocumentChunks,
  uploadDocument,
} from "../controllers/document.controller.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const documentRouter = express.Router();

documentRouter.post(
  "/upload-pdf",
  authMiddleware,
  upload.single("document"),
  uploadDocument,
);
documentRouter.post("/retrieve-data", authMiddleware, retrieveDocumentChunks);

export default documentRouter;
