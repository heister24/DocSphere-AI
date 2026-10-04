import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

// Generate Embeddings for Documents
export const generateEmbedding = async (documents) => {
  try {
    const texts = documents.map((doc) => doc.pageContent);
    // console.log(texts);
    const vectors = await embeddingModel.embedDocuments(texts);
    return vectors;
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw error;
  }
};

// Generate Embedding for Query
export const generateQueryEmbedding = async (query) => {
  try {
    if (!query) {
      throw new Error("Query is required");
    }

    const vector =
      await embeddingModel.embedQuery(query);

    return vector;
  } catch (error) {
    console.error(
      "Query embedding generation error:",
      error
    );

    throw error;
  }
};