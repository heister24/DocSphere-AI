import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config";

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
});

export const createQdrantCollection = async () => {
  try {
    const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;
    const collections = await qdrant.getCollections();
    // console.log(collections);

    const exists = collections.collections.some(
      (collection) => collection.name == COLLECTION_NAME,
    );

    if (exists) {
      console.log(`Qdrant collection "${COLLECTION_NAME}" already exists`);
      return;
    }

    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 3072, // Gemini embedding models produce vectors of 3072 dimensions.
        distance: "Cosine",
      },
    });
    console.log(`Qdrant collection "${COLLECTION_NAME}" created`);
  } catch (error) {
    console.error("Qdrant collection creation error:", error);
    throw error;
  }
};

export const deleteDocumentVectors = async ({ userId, documentId }) => {
  try {
    if (!documentId) {
      throw new Error("Document ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const collectionName = process.env.QDRANT_COLLECTION_NAME;

    await qdrant.delete(collectionName, {
      wait: true,
      filter: {
        must: [
          {
            key: "documentId",
            match: {
              value: documentId.toString(),
            },
          },
          {
            key: "userId",
            match: {
              value: userId.toString(),
            },
          },
        ],
      },
    });

    console.log(`Qdrant vectors deleted for document: ${documentId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Qdrant document vector deletion error:", error);

    throw error;
  }
};
  