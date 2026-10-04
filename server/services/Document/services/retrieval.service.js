import { generateEmbedding } from "./embedding.service.js";
import { qdrant } from "./qdrant.service.js";

export const retrieveRelevantChunks = async ({ query, userId, documentId, limit = 5 }) => {
  try {
    if (!query || query.length === 0) {
      throw new Error("Query is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Generating Embedding for query for better search with stored vector data
    const queryVector = await generateEmbedding([
      { pageContent: query, metadata: {} },
    ]);
    const vector = queryVector[0];

    // building filter
    const filter = {
      must: [
        {
          key: "userId",
          match: {
            value: userId.toString(),
          },
        },
      ],
    };

    if (documentId) {
      filter.must.push({
        key: "documentId",
        match: {
          value: documentId.toString(),
        },
      });
    }

    const searchResult = await qdrant.search(
      process.env.QDRANT_COLLECTION_NAME,
      {
        vector,
        filter,
        limit,
        with_payload: true,
      },
    );

    // returning imp info
    return searchResult.map((result) => ({
      score: result.score,
      text: result.payload?.text,
      documentId: result.payload?.documentId,
      userId: result.payload?.userId,
      chunkIndex: result.payload?.chunkIndex,
      metadata: result.payload?.metadata,
    }));
  } catch (error) {
    console.error("Retrieval error:", error);
    throw error;
  }
};
