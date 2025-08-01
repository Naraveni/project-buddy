import { z } from "zod";

export const blogMetadataSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  category: z.enum([
    "frontend",
    "backend",
    "devops",
    "deployment",
    "design",
    "ai",
    "product",
    "collaboration",
    "career",
    "other",
  ]),
  tags: z
    .string()
    .max(1000, "Tags string too long")
    .optional(),
  summary: z
    .string()
    .max(4000, "Summary is too long")
    .optional(),
  isPublic: z.boolean().optional(),
});
