import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state.js";
import {
  checkDocuments,
  fallbackNode,
  generateAnswerNode,
  retrieveDocumentsNode,
  rewriteQueryNode,
} from "./node.js";

const workFlow = new StateGraph(GraphState);

workFlow.addNode("rewriteQuery", rewriteQueryNode);
workFlow.addNode("retrieveDocuments", retrieveDocumentsNode);
workFlow.addNode("generateAnswer", generateAnswerNode);
workFlow.addNode("fallback", fallbackNode);

workFlow.addEdge(START, "rewriteQuery");
workFlow.addEdge("rewriteQuery", "retrieveDocuments");

// Conditional Edge

workFlow.addConditionalEdges("retrieveDocuments", checkDocuments, {
  generateAnswer: "generateAnswer",
  fallback: "fallback",
});
workFlow.addEdge("generateAnswer", END);

export const ragGraph = workFlow.compile();
