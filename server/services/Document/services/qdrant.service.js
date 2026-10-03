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
        size: 768, // Gemini embedding models produce vectors of 768 dimensions.
        distance: "Cosine",
      },
    });
    console.log(`Qdrant collection "${COLLECTION_NAME}" created`);
  } catch (error) {
    console.error("Qdrant collection creation error:", error);
    throw error;
  }
};
