import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { chatWithDocument } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/chat", authMiddleware, chatWithDocument);

export default chatRouter;
