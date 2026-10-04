import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { retrieveRelevantChunks } from "./retrieval.service.js";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.5-flash",
  temperature: 0.7,
});

export const generateAnswer = async ({
  query,
  userId,
  documentId,
  conversationHistory = [],
}) => {
  try {
    // building conversation history
    const history = conversationHistory
      .map((msg) => `${msg.role.toUpperCase()}:${msg.content}`)
      .join("\n");

    //  Create contextual query
    const contextualQueryPrompt = `
You are a query rewriting assistant.

Convert the user's latest question into a standalone
question that can be understood without the conversation history.

Conversation History:
${history || "No previous conversation."}

Latest User Question:
${query}

Return ONLY the standalone question.
`;

    const contextualQueryResponse = await llm.invoke(contextualQueryPrompt);

    const standaloneQuery =
      typeof contextualQueryResponse.content === "string"
        ? contextualQueryResponse.content.trim()
        : query;

    // retreive relevant chunks
    const relevantChunks = await retrieveRelevantChunks({
      query: standaloneQuery,
      userId: userId.toString(),
      documentId,
      limit: 5,
    });

    if (!relevantChunks || relevantChunks.length === 0) {
      return {
        answer: "I couldn't find relevant information in your document.",
        sources: [],
      };
    }

    // Build context from retrieved chunks
    const context = relevantChunks
      .map((res, index) => {
        const text = res.payload?.text || res.text || "";
        return `-----Context ${index + 1} ----- \n${text}`;
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

    //  sending prompt to LLM
    const response = await llm.invoke(prompt);

    return {
      answer: response.content,
      //   sources: results.map((result) => ({
      //     score: result.score,
      //     text: result.payload?.text || result.text || "",
      //     documentId: result.payload?.documentId || documentId,
      //   })),
    };
  } catch (error) {
    console.error("Generate document answer error:", error);
    throw error;
  }
};
