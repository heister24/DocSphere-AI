import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

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
