import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Flame } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import type { DailyProgress } from "@shared/schema";

interface ProgressTrackerProps {
  selectedDate: Date;
}

export function ProgressTracker({ selectedDate }: ProgressTrackerProps) {
  // Get week range
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Fetch progress for the entire week
  const weeklyProgressQueries = weekDays.map(day => {
    const dateString = format(day, "yyyy-MM-dd");
    return useQuery<DailyProgress[]>({
      queryKey: ["/api/progress", dateString],
      enabled: day <= new Date(), // Don't fetch future dates
    });
  });

  // Calculate weekly stats
  const weeklyStats = weeklyProgressQueries.reduce((acc, query, index) => {
    if (query.data && weekDays[index] <= new Date()) {
      const dayProgress = query.data;
      const completed = dayProgress.filter(p => p.completed).length;
      const total = dayProgress.length;
      
      acc.totalDays++;
      if (completed > 0) acc.activeDays++;
      if (total > 0 && completed === total) acc.perfectDays++;
      acc.totalTasks += total;
      acc.completedTasks += completed;
    }
    return acc;
  }, {
    totalDays: 0,
    activeDays: 0,
    perfectDays: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  const weeklyCompletionRate = weeklyStats.totalTasks > 0 
    ? Math.round((weeklyStats.completedTasks / weeklyStats.totalTasks) * 100)
    : 0;

  return (
    <Card data-testid="progress-tracker">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Overview */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => {
            const query = weeklyProgressQueries[index];
            const dayProgress = query.data || [];
            const completed = dayProgress.filter(p => p.completed).length;
            const total = dayProgress.length;
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isFuture = day > new Date();
            
            let bgColor = "bg-gray-100";
            if (!isFuture && total > 0) {
              const completionRate = completed / total;
              if (completionRate === 1) bgColor = "bg-green-500";
              else if (completionRate >= 0.7) bgColor = "bg-green-400";
              else if (completionRate >= 0.5) bgColor = "bg-yellow-400";
              else if (completionRate > 0) bgColor = "bg-orange-400";
              else bgColor = "bg-red-300";
            }

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center text-xs",
                  bgColor,
                  isToday && "ring-2 ring-blue-500",
                  isSelected && "ring-2 ring-purple-500",
                  isFuture && "opacity-50"
                )}
                data-testid={`day-${format(day, "yyyy-MM-dd")}`}
              >
                <div className={cn(
                  "font-medium",
                  (bgColor.includes("green") || bgColor.includes("red")) ? "text-white" : "text-gray-700"
                )}>
                  {format(day, "d")}
                </div>
                {!isFuture && total > 0 && (
                  <div className={cn(
                    "text-xs",
                    (bgColor.includes("green") || bgColor.includes("red")) ? "text-white" : "text-gray-600"
                  )}>
                    {completed}/{total}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Week Legend */}
        <div className="flex justify-center space-x-1 text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="w-8 text-center text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Weekly Stats */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Week Completion</span>
            <Badge variant="secondary" data-testid="badge-weekly-completion">
              {weeklyCompletionRate}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-600" data-testid="text-perfect-days">
                {weeklyStats.perfectDays}
              </div>
              <div className="text-xs text-gray-600">Perfect Days</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600" data-testid="text-active-days">
                {weeklyStats.activeDays}
              </div>
              <div className="text-xs text-gray-600">Active Days</div>
            </div>
          </div>
        </div>

        {/* Streak Info */}
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Stay Consistent!</span>
          </div>
          <p className="text-xs text-orange-700 mt-1">
            Complete tasks daily to build your streak and maintain momentum.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
