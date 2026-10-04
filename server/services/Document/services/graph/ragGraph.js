import { StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state.js";
import { generateAnswerNode } from "./node.js";

const workFlow = new StateGraph(GraphState);

workFlow.addNode("generateAnswer", generateAnswerNode);

workFlow.addEdge("__start__", "generateAnswer");
workFlow.addEdge("generateAnswer", "__end__");

export const ragGraph = workFlow.compile();
