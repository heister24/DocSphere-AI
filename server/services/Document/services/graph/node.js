import { generateEmbedding } from "../embedding.service.js";
import { qdrant } from "../qdrant.service.js";
import { generateAnswer } from "../rag.service.js";

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

export const retrieveDocuments = async (state) => {
  try {
    const { query, userId, documentId } = state;
    if (!query) {
      throw new Error("Question is required");
    }

    // Generate embedding for the user's question
    const queryVector = await generateEmbedding(query);

    // Search Qdrant
    const searchResult = await qdrant.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: 5,
      filter: {
        must: [
          {
            key: "userId",
            match: {
              value: userId,
            },
          },
          {
            key: "documentId",
            match: {
              value: documentId,
            },
          },
        ],
      },
    });

    const documents = searchResult.map((result) => ({
      score: result.score,
      text: result.payload.text || {},
    }));

    return documents;
  } catch (error) {
    console.error("Retrieve documents error:", error);
  }
};

export const generateAnswerNode = async (state) => {
  const { query, userId, documentId, conversationHistory, documents } = state;

  const result = await generateAnswer({
    query,
    userId,
    documentId,
    conversationHistory,
    documents,
  });
  return {
    answer: result.answer,
    sources: result.sources || [],
  };
};
