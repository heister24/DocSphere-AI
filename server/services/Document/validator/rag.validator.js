import { z } from "zod";

export const askDocumentSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Query is required")
    .max(1000, "Query is too long"),

  documentId: z.string().trim().min(1, "Document Id is required"),
  conversationHistory: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});
