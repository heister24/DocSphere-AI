import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  query: Annotation(),

  userId: Annotation(),

  documentId: Annotation(),

  conversationHistory: Annotation({
    default: () => [],
  }),

  answer: Annotation(),

  sources: Annotation({
    default: () => [],
  }),

  error: Annotation(),
});