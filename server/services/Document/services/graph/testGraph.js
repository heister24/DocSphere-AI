import "dotenv/config";
import { ragGraph } from "./ragGraph.js";

const result = await ragGraph.invoke({
  query: "What is this document about?",
  userId: "6abf6866b6dfb8a5f2d3c62d",
  documentId: "6ac148d2c807b2e0e284933a",
  conversationHistory: [],
});

console.log(result);
