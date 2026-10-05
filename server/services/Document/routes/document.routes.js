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

const documentRouter = express.Router();

documentRouter.post(
  "/upload-pdf",
  authMiddleware,
  upload.single("document"),
  uploadDocument,
);
documentRouter.post("/retrieve-data", authMiddleware, retrieveDocumentChunks);
documentRouter.get("/getAllDocuments", authMiddleware, getUserDocuments);
documentRouter.get("/getDocument/:id", authMiddleware, getDocumentById);
documentRouter.delete("/deleteDocument/:id", authMiddleware, deleteDocument);

export default documentRouter;
