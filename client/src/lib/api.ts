import { apiRequest } from "./queryClient";
import type { 
  Task, 
  InsertTask, 
  DailyProgress, 
  InsertDailyProgress, 
  UpdateDailyProgress 
} from "@shared/schema";

export const tasksApi = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response = await apiRequest("GET", "/api/tasks");
    return response.json();
  },

  // Create a new task
  create: async (task: InsertTask): Promise<Task> => {
    const response = await apiRequest("POST", "/api/tasks", task);
    return response.json();
  },

  // Update a task
  update: async (id: string, task: Partial<InsertTask>): Promise<Task> => {
    const response = await apiRequest("PATCH", `/api/tasks/${id}`, task);
    return response.json();
  },

  // Delete a task
  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/tasks/${id}`);
  },
};

export const progressApi = {
  // Get daily progress for a specific date
  getByDate: async (date: string): Promise<DailyProgress[]> => {
    const response = await apiRequest("GET", `/api/progress/${date}`);
    return response.json();
  },

  // Create or update daily progress
  createOrUpdate: async (date: string, progress: InsertDailyProgress): Promise<DailyProgress> => {
    const response = await apiRequest("POST", `/api/progress/${date}`, progress);
    return response.json();
  },

  // Update specific progress entry
  update: async (id: string, update: UpdateDailyProgress): Promise<DailyProgress> => {
    const response = await apiRequest("PATCH", `/api/progress/${id}`, update);
    return response.json();
  },

  // Get progress statistics
  getStats: async (): Promise<{
    currentStreak: number;
    bestStreak: number;
    totalCompleted: number;
    weeklyAverage: number;
  }> => {
    const response = await apiRequest("GET", "/api/stats");
    return response.json();
  },
};

export const api = {
  tasks: tasksApi,
  progress: progressApi,
};

export default api;
