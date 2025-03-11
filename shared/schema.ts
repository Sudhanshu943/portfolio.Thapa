import { pgTable, text, serial, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: json("content").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  link: text("link"),
  order: serial("order").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSectionSchema = createInsertSchema(sections);
export const insertProjectSchema = createInsertSchema(projects);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Profile content type
export const profileContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  experience: z.string(),
  projects: z.string(),
  overview: z.string(),
  profilePicture: z.string().url().optional(),
  location: z.string(),
  email: z.string().email(),
  phone: z.string(),
  education: z.object({
    degree: z.string(),
    period: z.string(),
    institution: z.string(),
  }),
  contact: z.object({
    location: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  achievements: z.array(z.string()),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })),
  goals: z.array(z.string()),
});

export type ProfileContent = z.infer<typeof profileContentSchema>;