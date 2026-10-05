import {
  addMessagesToConversation,
  createConversation,
  getConversation,
  getConversationHistory,
} from "../services/conversation.service.js";
import { ragGraph } from "../services/graph/ragGraph.js";

export const askDocumentQuestion = async (req, res) => {
  try {
    const { query, documentId, conversationId } = req.body;

    const userId = req.user._id;

    if (!query) {
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
    // Find / Create Conversation
    let conversation;

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

      // Make sure conversation belongs to the requested document
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

    // Save User Message
    await addMessagesToConversation({
      conversationId: conversation._id,
      userId,
      role: "user",
      content: query.trim(),
    });

    // Get Conversation History
    const conversationHistory = await getConversationHistory({
      conversationId: conversation._id,
      userId,
      limit: 10,
    });

    const result = await ragGraph.invoke({
      query,
      userId: userId.toString(),
      documentId,
      conversationHistory,
    });

    // Check Graph Error
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    // Save Assistant Message
    await addMessagesToConversation({
      conversationId: conversation._id,
      userId,
      role: "assistant",
      content: result.answer,
    });

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",

      data: {
        conversationId: conversation._id,
        answer: result.answer,
        sources: result.sources || [],
      },
    });
  } catch (error) {
    console.error("Ask document question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate answer",
      error: error.message,
    });
  }
};
