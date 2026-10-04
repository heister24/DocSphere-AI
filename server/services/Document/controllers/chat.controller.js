import { generateAnswer } from "../services/rag.service.js";

export const chatWithDocument = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { query, documentId } = req.body;
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

    const result = await generateAnswer({
      query,
      userId,
      documentId,
    });

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Chat with document error:", error);
    return res.status(500).json({
      success: false,   
      message: "Internal server error",
    });
  }
};
