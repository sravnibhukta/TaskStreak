import { type User, type InsertUser, type Task, type InsertTask, type DailyProgress, type InsertDailyProgress, type UpdateDailyProgress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  getDailyProgress(date: string): Promise<DailyProgress[]>;
  createOrUpdateDailyProgress(progress: InsertDailyProgress): Promise<DailyProgress>;
  updateDailyProgress(id: string, update: UpdateDailyProgress): Promise<DailyProgress | undefined>;
  getProgressStats(): Promise<{
    currentStreak: number;
    bestStreak: number;
    totalCompleted: number;
    weeklyAverage: number;
  }>;
}

// In-memory storage implementation for development
class MemStorage implements IStorage {
  private users: User[] = [];
  private tasks: Task[] = [];
  private dailyProgress: DailyProgress[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default tasks
    const defaultTasks: Task[] = [
      {
        id: "1",
        title: "GATE Exam Preparation",
        description: "Study computer science topics for GATE exam",
        emoji: "📚",
        timeSlots: 3,
        category: "study",
        color: "#3B82F6",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "2", 
        title: "Yoga & Meditation",
        description: "30 minutes of yoga and mindfulness practice",
        emoji: "🧘‍♀️",
        timeSlots: 1,
        category: "health",
        color: "#10B981",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Coding Practice",
        description: "Solve programming problems and work on projects",
        emoji: "💻",
        timeSlots: 2,
        category: "work",
        color: "#8B5CF6",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "4",
        title: "Reading Tech Articles",
        description: "Stay updated with latest technology trends",
        emoji: "📖",
        timeSlots: 1,
        category: "study",
        color: "#F59E0B",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    this.tasks = defaultTasks;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      ...user,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return this.tasks.filter(task => task.isActive);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.find(task => task.id === id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const newTask: Task = {
      id: randomUUID(),
      ...task,
      isActive: true,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, update: Partial<InsertTask>): Promise<Task | undefined> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return undefined;

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...update };
    return this.tasks[taskIndex];
  }

  async deleteTask(id: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks[taskIndex].isActive = false;
    return true;
  }

  // Daily progress methods
  async getDailyProgress(date: string): Promise<DailyProgress[]> {
    return this.dailyProgress.filter(progress => progress.date === date);
  }

  async createOrUpdateDailyProgress(progress: InsertDailyProgress): Promise<DailyProgress> {
    const existingIndex = this.dailyProgress.findIndex(
      p => p.taskId === progress.taskId && p.date === progress.date
    );

    if (existingIndex !== -1) {
      // Update existing progress
      this.dailyProgress[existingIndex] = {
        ...this.dailyProgress[existingIndex],
        ...progress,
      };
      return this.dailyProgress[existingIndex];
    } else {
      // Create new progress entry
      const newProgress: DailyProgress = {
        id: randomUUID(),
        ...progress,
      };
      this.dailyProgress.push(newProgress);
      return newProgress;
    }
  }

  async updateDailyProgress(id: string, update: UpdateDailyProgress): Promise<DailyProgress | undefined> {
    const progressIndex = this.dailyProgress.findIndex(progress => progress.id === id);
    if (progressIndex === -1) return undefined;

    this.dailyProgress[progressIndex] = { ...this.dailyProgress[progressIndex], ...update };
    return this.dailyProgress[progressIndex];
  }

  async getProgressStats(): Promise<{
    currentStreak: number;
    bestStreak: number;
    totalCompleted: number;
    weeklyAverage: number;
  }> {
    const completedProgress = this.dailyProgress.filter(p => p.completed);
    
    // Calculate simple stats (in a real app, this would be more sophisticated)
    const totalCompleted = completedProgress.length;
    
    // Group by date to calculate streaks
    const dateGroups = new Map<string, number>();
    completedProgress.forEach(progress => {
      const count = dateGroups.get(progress.date) || 0;
      dateGroups.set(progress.date, count + 1);
    });

    const sortedDates = Array.from(dateGroups.keys()).sort();
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Simple streak calculation (this is a basic implementation)
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (dateGroups.get(sortedDates[i])! > 0) {
        tempStreak++;
        if (i === sortedDates.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    const weeklyAverage = sortedDates.length > 0 ? Math.round(totalCompleted / Math.max(1, Math.ceil(sortedDates.length / 7))) : 0;

    return {
      currentStreak,
      bestStreak,
      totalCompleted,
      weeklyAverage,
    };
  }
}

// Export the storage instance
export const storage = new MemStorage();