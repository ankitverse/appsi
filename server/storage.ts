import { 
  type User, 
  type InsertUser,
  type Template,
  type InsertTemplate
} from "@shared/schema";
import { getDatabase } from "./db";
import session from "express-session";
import createMemoryStore from "memorystore";
import MongoStore from "connect-mongo";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Template methods
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: number): Promise<void>;
  
  // Session store for auth
  sessionStore: session.Store;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, Template>;
  private userId: number;
  private templateId: number;
  sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.userId = 1;
    this.templateId = 1;
    
    // Set up session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired sessions every 24h
    });
    
    // Add some sample templates
    this.initSampleTemplates();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
  
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateId++;
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }
  
  async updateTemplate(id: number, updates: Partial<InsertTemplate>): Promise<Template> {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    const updatedTemplate = { ...template, ...updates };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<void> {
    this.templates.delete(id);
  }
  
  // Initialize sample templates
  private initSampleTemplates() {
    // Portfolio templates
    this.createTemplate({
      name: "Portfolio Pro",
      description: "Perfect for showcasing your work",
      category: "Portfolio",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      content: JSON.stringify([
        {
          id: "nav-container",
          type: "box",
          content: "",
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 5%",
            backgroundColor: "#ffffff",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            zIndex: "100",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }
        },
        // More elements...
      ])
    });
    
    // Additional templates would be here
  }
}

// MongoDB storage implementation
export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use a default MongoDB connection string that's properly formatted
    const mongoUrl = 'mongodb://localhost:27017/website_builder';
    
    this.sessionStore = MongoStore.create({
      mongoUrl: mongoUrl,
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: 'native',
      touchAfter: 24 * 3600 // time period in seconds between session updates
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const db = await getDatabase();
    const user = await db.collection<User>('users').findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDatabase();
    const user = await db.collection<User>('users').findOne({ username });
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getDatabase();
    return await db.collection<User>('users').find().toArray();
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDatabase();
    
    // Find the highest ID to determine the next ID
    const highestUser = await db.collection<User>('users')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = highestUser.length > 0 ? highestUser[0].id + 1 : 1;
    
    const user: User = { ...insertUser, id: nextId };
    await db.collection<User>('users').insertOne(user);
    return user;
  }
  
  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    const db = await getDatabase();
    return await db.collection<Template>('templates').find().toArray();
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    const db = await getDatabase();
    const template = await db.collection<Template>('templates').findOne({ id });
    return template || undefined;
  }
  
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const db = await getDatabase();
    
    // Make sure content is properly formatted
    let content = insertTemplate.content;
    if (typeof content === 'string') {
      try {
        // Try to parse it to ensure it's valid JSON
        content = JSON.parse(content);
      } catch (e) {
        // If it's already stringified, keep it as is
      }
    }
    
    // Find the highest ID to determine the next ID
    const highestTemplate = await db.collection<Template>('templates')
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = highestTemplate.length > 0 ? highestTemplate[0].id + 1 : 1;
    
    const template: Template = { 
      ...insertTemplate, 
      id: nextId,
      content
    };
    
    await db.collection<Template>('templates').insertOne(template);
    return template;
  }
  
  async updateTemplate(id: number, updates: Partial<InsertTemplate>): Promise<Template> {
    const db = await getDatabase();
    
    // Handle content formatting if present
    if (updates.content) {
      let content = updates.content;
      if (typeof content === 'string') {
        try {
          // Try to parse it to ensure it's valid JSON
          content = JSON.parse(content);
        } catch (e) {
          // If it's already stringified, keep it as is
        }
      }
      
      updates = {
        ...updates,
        content,
      };
    }
    
    const result = await db.collection<Template>('templates')
      .findOneAndUpdate(
        { id },
        { $set: updates },
        { returnDocument: 'after' }
      );
    
    if (!result) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    return result;
  }
  
  async deleteTemplate(id: number): Promise<void> {
    const db = await getDatabase();
    await db.collection<Template>('templates').deleteOne({ id });
  }
}

// Export an instance of the appropriate storage class
// For now, we'll use the in-memory storage since MongoDB isn't available in the environment
// In a production environment, you would use the MongoDB implementation
export const storage = new MemStorage();

// When MongoDB is available, you would use this instead:
// export const storage = new MongoDBStorage();