import { StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state.js";
import { generateAnswerNode, retrieveDocuments } from "./node.js";

const workFlow = new StateGraph(GraphState);

workFlow.addNode("retrieveDocuments", retrieveDocuments);
workFlow.addNode("generateAnswer", generateAnswerNode);

workFlow.addEdge("__start__", "retrieveDocuments");
workFlow.addEdge("retrieveDocuments", "generateAnswer");
workFlow.addEdge("generateAnswer", "__end__");

export const ragGraph = workFlow.compile();
