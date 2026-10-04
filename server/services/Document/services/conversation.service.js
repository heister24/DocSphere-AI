import Conversation from "../models/conversation.model.js";

export const createConversation = async ({
  userId,
  documentId,
  title = "New Conversation",
}) => {
  try {
    const conversation = await Conversation.create({
      userId,
      documentId,
      title,
      messages: [],
    });
    return conversation;
  } catch (error) {
    console.error("Create conversation error:", error);
    throw error;
  }
};

export const getConversation = async ({ userId, conversationId }) => {
  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });
    return conversation;
  } catch (error) {
    console.error("Get conversation error:", error);
    throw error;
  }
};

export const addMessagesToConversation = async ({
  conversationId,
  userId,
  role,
  content,
}) => {
  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    conversation.messages.push({
      role,
      content,
    });

    await conversation.save();
    return conversation;
  } catch (error) {
    console.error("Add conversation message error:", error);
    throw error;
  }
};

export const getConversationHistory = async ({
  conversationId,
  userId,
  limit = 10,
}) => {
  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    }).lean();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messages = conversation.messages || [];

    return messages.slice(-limit);
  } catch (error) {
    console.error(
      "Get conversation history error:",
      error
    );

    throw error;
  }
};