import { generateQueryEmbedding } from "../embedding.service.js";
import { qdrant } from "../qdrant.service.js";
import { generateAnswer, llm } from "../rag.service.js";

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

export const retrieveDocumentsNode = async (state) => {
  try {
    const { standaloneQuery, query, userId, documentId } = state;
    if (!query) {
      throw new Error("Question is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!documentId) {
      throw new Error("Document ID is required");
    }

    const searchQuery = standaloneQuery || query;

    // Generate embedding for the user's question
    const queryVector = await generateQueryEmbedding(searchQuery);

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

    return { documents };
  } catch (error) {
    console.error("Retrieve documents error:", error);
  }
};

export const generateAnswerNode = async (state) => {
  const { query, userId, conversationHistory = [], documents = [] } = state;

  const result = await generateAnswer({
    query,
    userId,
    conversationHistory,
    documents,
  });
  return {
    answer: result.answer,
    sources: result.sources || [],
  };
};

export const rewriteQueryNode = async (state) => {
  try {
    const { query, conversationHistory = [] } = state;

    const history = conversationHistory
      .map((msg) => `${msg.role.toUpperCase()}:${msg.content}`)
      .join("\n");

    const prompt = `
You are a query rewriting assistant.

Convert the user's latest question into a standalone
question that can be understood without the conversation history.

Conversation History:
${history || "No previous conversation."}

Latest User Question:
${query}

Return ONLY the standalone question.
`;

    const response = await llm.invoke(prompt);
    const standaloneQuery =
      typeof response.content === "string" ? response.content.trim() : query;

    return {
      standaloneQuery,
    };
  } catch (error) {
    console.error("Rewrite query error:", error);

    return {
      standaloneQuery: state.query,
      error: error.message,
    };
  }
};

export const checkDocuments = (state) => {
  if (state.documents && state.documents.length > 0) {
    return "generateAnswer";
  }

  return "fallback";
};

export const fallbackNode = async () => {
  return {
    answer: "I couldn't find relevant information in your document.",
    sources: [],
  };
};

export const filterRelevantDocumentsNode = async (state) => {
  try {
    const { documents = [] } = state;

    const minScore = Number(process.env.RAG_MIN_SCORE || 0.5);

    const relevantDocuments = documents.filter(
      (document) => document.score >= minScore,
    );

    console.log(`Retrieved documents: ${documents.length}`);

    console.log(`Relevant documents: ${relevantDocuments.length}`);

    return {
      documents: relevantDocuments,
    };
  } catch (error) {
    console.error("Filter relevant documents error:", error);

    return {
      documents: [],
      error: error.message,
    };
  }
};
