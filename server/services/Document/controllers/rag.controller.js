import { ragGraph } from "../services/graph/ragGraph.js";

export const askDocumentQuestion = async (req, res) => {
  try {
    const { query, documentId, conversationHistory = [] } = req.body;

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

    const result = await ragGraph.invoke({
      query,
      userId: userId.toString(),
      documentId,
      conversationHistory,
    });

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      answer: result.answer,
      sources: result.sources || [],
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
