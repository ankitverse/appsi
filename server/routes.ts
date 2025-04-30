import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTemplateSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middlewares
  const { isAuthenticated, isAdmin } = setupAuth(app);
  
  // Public route - Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      console.log('Getting all templates from storage');
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error retrieving templates:', error);
      res.status(500).json({ message: "Failed to retrieve templates" });
    }
  });

  // Public route - Get template by ID
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`Getting template with id ${id}`);
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error(`Error retrieving template ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to retrieve template" });
    }
  });

  // Admin-only routes for template management
  
  // Create a new template - Admin only
  app.post("/api/templates", isAdmin, async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const newTemplate = await storage.createTemplate(validatedData);
      res.status(201).json(newTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid template data", 
          errors: error.errors 
        });
      }
      console.error('Error creating template:', error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update a template - Admin only
  app.put("/api/templates/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Only validate the fields that are provided
      const updateDataSchema = insertTemplateSchema.partial();
      const validatedData = updateDataSchema.parse(req.body);
      
      const updatedTemplate = await storage.updateTemplate(id, validatedData);
      res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid template data", 
          errors: error.errors 
        });
      }
      console.error(`Error updating template ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  // Delete a template - Admin only
  app.delete("/api/templates/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      await storage.deleteTemplate(id);
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting template ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
