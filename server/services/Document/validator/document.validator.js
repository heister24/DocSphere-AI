import { z } from "zod";

export const documentSchema = z.object({
  id: z.string().trim().min(1, "Document Id is required"),
});
