import { getUserConversations, getConversation } from "../services/conversation.service.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const conversations = await getUserConversations(userId);
    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const conversationId = req.params.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const conversation = await getConversation({ userId, conversationId });
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error("Get conversation by ID error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
