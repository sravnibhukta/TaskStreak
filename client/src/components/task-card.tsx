import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  completed: boolean;
  onToggle: (completed: boolean) => void;
  isLoading?: boolean;
}

export function TaskCard({ task, completed, onToggle, isLoading = false }: TaskCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isLoading) return;
    
    setIsAnimating(true);
    onToggle(!completed);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const categoryColors: Record<string, string> = {
    study: "bg-blue-100 text-blue-800 border-blue-200",
    exercise: "bg-green-100 text-green-800 border-green-200",
    work: "bg-purple-100 text-purple-800 border-purple-200",
    personal: "bg-pink-100 text-pink-800 border-pink-200",
    health: "bg-red-100 text-red-800 border-red-200",
    creativity: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md cursor-pointer",
        completed && "bg-green-50 border-green-200",
        isAnimating && "animate-bounce-in"
      )}
      onClick={handleToggle}
      data-testid={`task-card-${task.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Checkbox
              checked={completed}
              disabled={isLoading}
              className={cn(
                "w-5 h-5",
                completed && "border-green-500 bg-green-500"
              )}
              data-testid={`checkbox-task-${task.id}`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl" data-testid={`emoji-${task.id}`}>{task.emoji}</span>
              <h3 className={cn(
                "font-medium text-gray-900 truncate",
                completed && "line-through text-gray-500"
              )} data-testid={`title-${task.id}`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className={cn(
                "text-sm text-gray-600 mb-2",
                completed && "line-through"
              )} data-testid={`description-${task.id}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", categoryColors[task.category] || "bg-gray-100 text-gray-800")}
                data-testid={`category-${task.id}`}
              >
                {task.category}
              </Badge>
              
              {task.timeSlots > 1 && (
                <Badge variant="secondary" className="text-xs" data-testid={`timeslots-${task.id}`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {task.timeSlots}x
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {completed ? (
              <CheckCircle className="w-6 h-6 text-green-500" data-testid={`completed-icon-${task.id}`} />
            ) : (
              <div 
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: task.color, borderColor: task.color }}
                data-testid={`color-indicator-${task.id}`}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
