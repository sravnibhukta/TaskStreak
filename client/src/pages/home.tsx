import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "@/components/task-card";
import { ProgressTracker } from "@/components/progress-tracker";
import { 
  CalendarIcon, 
  Plus, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask, DailyProgress, InsertDailyProgress } from "@shared/schema";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<InsertTask>>({
    title: "",
    description: "",
    emoji: "📚",
    timeSlots: 1,
    category: "study",
    color: "#3B82F6"
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Fetch daily progress
  const { data: dailyProgress = [], isLoading: progressLoading } = useQuery<DailyProgress[]>({
    queryKey: ["/api/progress", dateString],
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (task: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsCreateTaskOpen(false);
      setNewTask({
        title: "",
        description: "",
        emoji: "📚",
        timeSlots: 1,
        category: "study",
        color: "#3B82F6"
      });
      toast({
        title: "Task created!",
        description: "Your new task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const progressData: InsertDailyProgress = {
        taskId,
        date: dateString,
        completed,
        completedAt: completed ? new Date() : null,
        streak: 0, // Will be calculated on the backend
        notes: "",
        userId: null, // For now, not implementing user system
      };

      const response = await apiRequest("POST", `/api/progress/${dateString}`, progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", dateString] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = () => {
    if (!newTask.title?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate(newTask as InsertTask);
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateProgressMutation.mutate({ taskId, completed });
  };

  const completedTasks = dailyProgress.filter(p => p.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const categories = [
    { value: "study", label: "Study", icon: "📚" },
    { value: "exercise", label: "Exercise", icon: "💪" },
    { value: "work", label: "Work", icon: "💼" },
    { value: "personal", label: "Personal", icon: "✨" },
    { value: "health", label: "Health", icon: "🏥" },
    { value: "creativity", label: "Creativity", icon: "🎨" },
  ];

  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", 
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-home">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TaskStreak</h1>
                <p className="text-sm text-gray-600">Study Progress Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    data-testid="button-date-picker"
                  >
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-task">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter task title"
                        value={newTask.title || ""}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        data-testid="input-task-title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter task description"
                        value={newTask.description || ""}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        data-testid="textarea-task-description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="emoji">Emoji</Label>
                        <Input
                          id="emoji"
                          placeholder="📚"
                          value={newTask.emoji || ""}
                          onChange={(e) => setNewTask({ ...newTask, emoji: e.target.value })}
                          data-testid="input-task-emoji"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="timeSlots">Time Slots</Label>
                        <Input
                          id="timeSlots"
                          type="number"
                          min="1"
                          max="8"
                          value={newTask.timeSlots || 1}
                          onChange={(e) => setNewTask({ ...newTask, timeSlots: parseInt(e.target.value) })}
                          data-testid="input-task-timeslots"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newTask.category || "study"} 
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger data-testid="select-task-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className={cn(
                              "w-8 h-8 rounded-full border-2",
                              newTask.color === color ? "border-gray-900" : "border-gray-200"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewTask({ ...newTask, color })}
                            data-testid={`button-color-${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateTaskOpen(false)}
                      data-testid="button-cancel-task"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTask}
                      disabled={createTaskMutation.isPending}
                      data-testid="button-save-task"
                    >
                      {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Progress Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Today's Progress
                  </CardTitle>
                  <Badge variant="secondary" data-testid="badge-completion-rate">
                    {completedTasks}/{totalTasks} Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Overall Completion</span>
                      <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" data-testid="progress-completion" />
                  </div>
                  
                  {stats && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600" data-testid="text-current-streak">
                          {stats.currentStreak || 0}
                        </div>
                        <div className="text-xs text-gray-600">Current Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600" data-testid="text-best-streak">
                          {stats.bestStreak || 0}
                        </div>
                        <div className="text-xs text-gray-600">Best Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600" data-testid="text-total-completed">
                          {stats.totalCompleted || 0}
                        </div>
                        <div className="text-xs text-gray-600">Total Completed</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Daily Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-600 mb-4">Create your first task to start tracking your progress</p>
                    <Button onClick={() => setIsCreateTaskOpen(true)} data-testid="button-create-first-task">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => {
                      const progress = dailyProgress.find(p => p.taskId === task.id);
                      return (
                        <TaskCard
                          key={task.id}
                          task={task}
                          completed={progress?.completed || false}
                          onToggle={(completed) => handleToggleTask(task.id, completed)}
                          isLoading={updateProgressMutation.isPending}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasks Today</span>
                  <span className="font-medium" data-testid="text-tasks-today">{totalTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600" data-testid="text-completed-today">{completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium text-orange-600" data-testid="text-remaining-today">{totalTasks - completedTasks}</span>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <ProgressTracker selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
}
