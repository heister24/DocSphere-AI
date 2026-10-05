import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { askDocumentSchema } from "../validator/rag.validator.js";
import { askDocumentQuestion } from "../controllers/rag.controller.js";

const ragRouter = express.Router();

ragRouter.post(
  "/ask",
  authMiddleware,
  validationMiddleware(askDocumentSchema),
  askDocumentQuestion,
);

export default ragRouter;
