import { generateEmbedding } from "./embedding.service.js";
import { qdrant } from "./qdrant.service.js";
import { v4 as uuidv4 } from "uuid";

export const storeDocumentsInQdrant = async ({
  documents,
  documentId,
  userId,
}) => {
  try {
    if (!documents || documents.length === 0) {
      throw new Error("No Document provided for vector storage");
    }

    // Generate embedding for all chunks
    const vectors = await generateEmbedding(documents);

    // Create Qdrant points
    const points = documents.map((doc, index) => ({
      id: uuidv4(),
      vector: vectors[index],
      payload: {
        documentId,
        userId,
        text: doc.pageContent,
        metadata: doc.metadata || {},
        chunkIndex: index,
      },
    }));

    // console.log(points);

    // Store vectors in Qdrant
    await qdrant.upsert(process.env.QDRANT_COLLECTION_NAME, {
      wait: true,
      points: points,
    });
    console.log(`${points.length} document chunks stored in Qdrant`);
    return {
      success: true,
      count: points.length,
    };
  } catch (error) {
    console.error("Qdrant vector storage error:", error);
    throw error;
  }
};
