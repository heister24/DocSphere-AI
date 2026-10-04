import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { retrieveRelevantChunks } from "./retrieval.service.js";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.7-flash",
  temperature: 0.7,
});

export const generateAnswer = async ({ query, userId, documentId }) => {
  try {
    const relevantChunks = await retrieveRelevantChunks({
      query,
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
You are DocSphere, an AI assistant that answers questions
about the user's uploaded documents.

Answer the user's question using ONLY the provided context.

Rules:
- Do not use outside knowledge.
- Do not make up information.
- If the answer is not present in the context, clearly say that
  the information was not found in the document.
- Give a clear and concise answer.
- Use the context carefully.

Context:
${context}

User Question:
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
