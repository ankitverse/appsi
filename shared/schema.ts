import { z } from "zod";

// Define schemas directly with Zod
export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  thumbnail: z.string(),
  content: z.any() // Accept any type for content (string or parsed object)
});

export const insertTemplateSchema = templateSchema.omit({ id: true });

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = z.infer<typeof templateSchema>;

// Schema for authentication
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string()
});

export const insertUserSchema = userSchema.omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;
