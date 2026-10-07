import {
  addMessagesToConversation,
  createConversation,
  getConversation,
  getConversationHistory,
} from "../services/conversation.service.js";
import { generateAnswer } from "../services/rag.service.js";
import { retrieveRelevantChunks } from "../services/retrieval.service.js";

export const chatWithDocument = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { query, documentId, conversationId } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    let conversation;
    // Find or create conversation
    if (conversationId) {
      conversation = await getConversation({
        userId,
        conversationId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      // Security check
      if (conversation.documentId.toString() !== documentId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Conversation does not belong to this document",
        });
      }
    } else {
      conversation = await createConversation({
        userId,
        documentId,
        title: query.trim().slice(0, 25),
      });
    }

    // Save user message
    await addMessagesToConversation({
      conversationId: conversation._id,
      userId,
      role: "user",
      content: query.trim(),
    });

    const conversationHistory = await getConversationHistory({
      conversationId: conversation._id,
      userId,
      limit: 10,
    });

    const retrievedChunks = await retrieveRelevantChunks({
      query: query.trim(),
      userId: userId.toString(),
      documentId,
      limit: 5,
    });

    const result = await generateAnswer({
      query: query.trim(),
      userId: userId.toString(),
      documents: retrievedChunks,
      conversationHistory: conversationHistory,
    });

    // Save assistant message
    await addMessagesToConversation({
      conversationId: conversation._id,
      userId: userId.toString(),
      role: "assistant",
      content: result.answer,
    });

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",

      data: {
        conversationId: conversation._id,
        answer: result.answer,
        sources: result.sources,
      },
    });
  } catch (error) {
    console.error("Chat with document error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
