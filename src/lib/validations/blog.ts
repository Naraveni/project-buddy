import { z } from "zod";

const blogCategories = [
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
  ] as [string, ...string[]];

export const blogMetadataSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  category: z.enum(blogCategories),
  tags: z
    .array(z.object({
      id: z.string().nullable(),
      name: z.string().min(5, "Tag name must 5 characters in length").max(50, "Tag name is too long"  )})),
  summary: z
    .string()
    .max(4000, "Summary is too long")
    .optional(),
  isPublic: z.boolean().optional(),
});

export const blogContentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft","published"])
}).strict()


export const blogIndexFilterSchema = z.object({
  category: z.enum(blogCategories),
  status: z.enum(["draft", "published"])
})
