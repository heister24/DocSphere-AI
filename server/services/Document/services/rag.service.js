import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { saveAiUsage } from "./usage.service.js";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.1-flash-lite",
  temperature: 0.7,
});

//  Generate Document Answer
export const generateAnswer = async ({
  query,
  userId,
  documents = [],
  conversationHistory = [],
}) => {
  try {
    if (!query) {
      throw new Error("Query is required");
    }
    // building conversation history
    const history = conversationHistory
      .map((msg) => `${msg.role.toUpperCase()}:${msg.content}`)
      .join("\n");

    //   Building context from retrieved documents
    const context = documents
      .map((doc, index) => {
        const text = doc.text || doc.payload?.text || "";
        return `-----Context${index + 1}-----\n${text}`;
      })
      .join("\n\n");

    //   RAG Prompt
    const prompt = `
You are DocSphere, an AI document assistant.

Answer the user's question using the provided document
context and conversation history.

Rules:
1. Use the document context as the primary source of truth.
2. Do not invent information.
3. Do not use outside knowledge for document-specific claims.
4. Use conversation history to understand references such as
   "it", "they", "this", or "that".
5. If the information is not available in the document,
   clearly say that it was not found.
6. Give a clear and concise answer.

Conversation History:
${history || "No previous conversation."}

Document Context:
${context}

Current User Question:
${query}

Answer:
`;

    //  Generate Answer
    const response = await llm.invoke(prompt);

    await saveAiUsage({
      userId,
      requestType: "RAG_ANSWER",
      usageMetadata: response.usage_metadata,
      model: "gemini-3.1-flash-lite",
    });

    return {
      answer: response.content,

      sources: documents.map((document) => ({
        score: document.score,
        text: document.text || document.payload?.text || "",
        documentId: document.documentId || document.payload?.documentId,
      })),
    };
  } catch (error) {
    console.error("Generate document answer error:", error);
    throw error;
  }
};
