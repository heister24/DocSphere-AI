import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  query: Annotation(),

  // Rewritten standalone question
  standaloneQuery: Annotation(),

  userId: Annotation(),

  documentId: Annotation(),

  conversationHistory: Annotation({
    default: () => [],
  }),

  // Retrieved chunks
  documents: Annotation({
    default: () => [],
  }),

  answer: Annotation(),

  sources: Annotation({
    default: () => [],
  }),

  error: Annotation(),
});
