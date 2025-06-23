import { z } from "zod";

export interface ProjectSchema {
    name: string;
    description: string;
    image_url?: string;
    github_url?: string;
    website_url?: string;
    status: "draft" | "public" | "archived";
    is_public: boolean;
    category?: string;
    file_name?: string;
}

export const projectSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(100).max(2000),
    image_url: z.string().trim().optional(),
    github_url: z.string().trim().url().or(z.literal('')),
    website_url: z.string().trim().url().or(z.literal('')),
    status: z.enum(["draft", "published", "archived"]),
    file_name: z.string().trim().optional(),
   is_public: z
  .string()
  .transform((val) => val === 'true' || val === 'false')
  .optional(),
    category: z.string().trim().optional(),
});
