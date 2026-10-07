import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getConversations, getConversationById } from "../controllers/conversation.controller.js";

const conversationRouter = express.Router();

conversationRouter.get("/conversations", authMiddleware, getConversations);
conversationRouter.get("/conversations/:id", authMiddleware, getConversationById);

export default conversationRouter;
