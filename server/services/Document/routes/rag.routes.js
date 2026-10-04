import express from "express";
import { askDocumentQuestion } from "../controllers/rag.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const ragRouter = express.Router();

ragRouter.post("/ask", authMiddleware, askDocumentQuestion);

export default ragRouter;
