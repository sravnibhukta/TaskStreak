import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertDailyProgressSchema, updateDailyProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create a new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedTask);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid task data", details: error.errors });
      } else {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
      }
    }
  });

  // Get daily progress for a specific date
  app.get("/api/progress/:date", async (req, res) => {
    try {
      const { date } = req.params;
      
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
      }

      const progress = await storage.getDailyProgress(date);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching daily progress:", error);
      res.status(500).json({ error: "Failed to fetch daily progress" });
    }
  });

  // Update daily progress for a specific date and task
  app.post("/api/progress/:date", async (req, res) => {
    try {
      const { date } = req.params;
      
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
      }

      const validatedProgress = insertDailyProgressSchema.parse({
        ...req.body,
        date,
      });

      const progress = await storage.createOrUpdateDailyProgress(validatedProgress);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid progress data", details: error.errors });
      } else {
        console.error("Error updating daily progress:", error);
        res.status(500).json({ error: "Failed to update daily progress" });
      }
    }
  });

  // Update specific progress entry
  app.patch("/api/progress/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdate = updateDailyProgressSchema.parse(req.body);
      
      const progress = await storage.updateDailyProgress(id, validatedUpdate);
      if (!progress) {
        return res.status(404).json({ error: "Progress entry not found" });
      }
      
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        console.error("Error updating progress:", error);
        res.status(500).json({ error: "Failed to update progress" });
      }
    }
  });

  // Get progress statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getProgressStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
