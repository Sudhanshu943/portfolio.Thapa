import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertSectionSchema, insertProjectSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Sections API
  app.get("/api/sections", async (_req, res) => {
    const sections = await storage.getSections();
    res.json(sections);
  });

  app.post("/api/sections", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertSectionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const section = await storage.createSection(parsed.data);
    res.status(201).json(section);
  });

  app.patch("/api/sections/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const section = await storage.updateSection(Number(req.params.id), req.body);
    res.json(section);
  });

  app.delete("/api/sections/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteSection(Number(req.params.id));
    res.sendStatus(204);
  });

  // Projects API
  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.patch("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const project = await storage.updateProject(Number(req.params.id), req.body);
    res.json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteProject(Number(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
