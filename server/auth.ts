import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

dotenv.config();

console.log("SESSION_SECRET:", process.env.SESSION_SECRET); // Add this line to log the secret

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: storage.sessionStore,
    cookie: { secure: false } // Set to true if using HTTPS
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username: string, password: string, done: (arg0: null, arg1: boolean) => any) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user: { id: any; }, done: (arg0: null, arg1: any) => any) => done(null, user.id));
  passport.deserializeUser(async (id: number, done: (arg0: null, arg1: any) => void) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req: { body: { username: string; password: string; }; login: (arg0: any, arg1: (err: any) => any) => void; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; json: { (arg0: any): void; new(): any; }; }; }, next: (arg0: any) => any) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err: any) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req: { user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req: { logout: (arg0: (err: any) => any) => void; }, res: { sendStatus: (arg0: number) => void; }, next: (arg0: any) => any) => {
    req.logout((err: any) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req: { isAuthenticated: () => any; user: any; }, res: { sendStatus: (arg0: number) => any; json: (arg0: any) => void; }) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
