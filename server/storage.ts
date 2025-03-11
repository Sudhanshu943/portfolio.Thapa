import { User, InsertUser, Section, Project, InsertSection, InsertProject } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getSections(): Promise<Section[]>;
  getSection(id: number): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: number, section: Partial<Section>): Promise<Section>;
  deleteSection(id: number): Promise<void>;

  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sections: Map<number, Section>;
  private projects: Map<number, Project>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.sections = new Map();
    this.projects = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create default admin user
    this.createDefaultUser();
  }

  private async createDefaultUser() {
    const defaultUser: InsertUser = {
      username: "aadidimri",
      password: await hashPassword("aadi@123"),
    };

    const existingUser = await this.getUserByUsername(defaultUser.username);
    if (!existingUser) {
      await this.createUser(defaultUser);
    }

    const defaultHeroSection = {
      name: "hero",
      content: {
        title: "Hi, I'm Aditya Dimri",
        subtitle: "Computer Science Student & Tech Enthusiast",
        overview: "Passionate about AI development and innovative technology solutions",
        experience: "Currently Studying",
        projects: "Multiple Projects",
        profilePicture: "https://avatars.githubusercontent.com/u/your-username",
        contact: {
          location: "📍 Dehradun",
          email: "📧 adityadimri04@gmail.com",
          phone: "📞 8979757831"
        }
      },
      isPublic: true
    };

    const defaultEducationSection = {
      name: "education",
      content: {
        degree: "B.Tech in Computer Science & Engineering",
        period: "2022-2026",
        institution: "Graphic Era Hill University",
        achievements: [
          "🔹 Haptic Hearing System – Developing for a hackathon",
          "🔹 Cursor Controller Using Webcam – Built a system to control the cursor with hand gestures",
          "🔹 Social Media Website – Created during diploma, a complete social networking platform"
        ]
      },
      isPublic: true
    };

    const defaultSkillsSection = {
      name: "skills",
      content: {
        categories: [
          {
            title: "Technical Skills",
            skills: [
              "🔹 AI & Ecosystem Development",
              "🔹 C Programming",
              "🔹 Web Development",
              "🔹 Gaming & BGMI"
            ]
          }
        ]
      },
      isPublic: true
    };

    const defaultGoalsSection = {
      name: "goals",
      content: {
        goals: [
          "🔹 Build an AI ecosystem for India",
          "🔹 Participate & win hackathons with unique tech innovations",
          "🔹 Learn advanced programming & AI development",
          "🔹 Expand YouTube channel ByteBeats with creative AI content"
        ]
      },
      isPublic: true
    };

    await this.createSection(defaultHeroSection);
    await this.createSection(defaultEducationSection);
    await this.createSection(defaultSkillsSection);
    await this.createSection(defaultGoalsSection);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSections(): Promise<Section[]> {
    return Array.from(this.sections.values());
  }

  async getSection(id: number): Promise<Section | undefined> {
    return this.sections.get(id);
  }

  async createSection(section: InsertSection): Promise<Section> {
    const id = this.currentId++;
    const newSection = { ...section, id, isPublic: section.isPublic ?? true };
    this.sections.set(id, newSection);
    return newSection;
  }

  async updateSection(id: number, section: Partial<Section>): Promise<Section> {
    const existing = await this.getSection(id);
    if (!existing) throw new Error("Section not found");
    const updated = { ...existing, ...section };
    this.sections.set(id, updated);
    return updated;
  }

  async deleteSection(id: number): Promise<void> {
    this.sections.delete(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const newProject = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    const existing = await this.getProject(id);
    if (!existing) throw new Error("Project not found");
    const updated = { ...existing, ...project };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }
}

export const storage = new MemStorage();