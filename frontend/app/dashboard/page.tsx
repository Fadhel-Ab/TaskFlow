"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskStatus, Task } from "@/types/task";
import { getTasks } from "@/lib/tasks";
import { TaskCard } from "@/components/tasks/task-card";
import {
  CircleDot,
  UserPlus,
  PlayCircle,
  Eye,
  CheckCircle2,
  Layers,
} from "lucide-react";

// Columns configuration with styling helpers added
const columns = [
  {
    title: "Backlog",
    status: TaskStatus.BACKLOG,
    icon: CircleDot,
    color: "text-muted-foreground",
    bg: "bg-muted/40",
  },
  {
    title: "Assigned",
    status: TaskStatus.ASSIGNED,
    icon: UserPlus,
    color: "text-blue-500",
    bg: "bg-blue-500/5",
  },
  {
    title: "In Progress",
    status: TaskStatus.IN_PROGRESS,
    icon: PlayCircle,
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
  {
    title: "In Review",
    status: TaskStatus.IN_REVIEW,
    icon: Eye,
    color: "text-purple-500",
    bg: "bg-purple-500/5",
  },
  {
    title: "Done",
    status: TaskStatus.DONE,
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-background p-6 md:p-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-7 w-7 text-primary" />
            TaskFlow Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, track, and optimize your team's workflow in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
            Total Tasks: {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );
          const Icon = column.icon;

          return (
            <div
              key={column.status}
              className="flex flex-col rounded-xl bg-muted/30 p-3 border border-border/60 backdrop-blur-sm min-w-[250px] md:min-w-0"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${column.color}`} />
                  <h2 className="font-semibold text-sm tracking-tight text-foreground">
                    {column.title}
                  </h2>
                </div>
                <Badge
                  variant="secondary"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground"
                >
                  {columnTasks.length}
                </Badge>
              </div>

              {/* Task Container */}
              <div
                className={`flex flex-col gap-3 rounded-lg p-2 min-h-[450px] transition-colors duration-200 ${column.bg}`}
              >
                {isLoading ? (
                  // Simple Loading Skeleton State
                  <div className="space-y-3">
                    <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                    <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                  </div>
                ) : columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <TaskCard task={task} />
                    </div>
                  ))
                ) : (
                  // Clean Empty State
                  <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 border border-dashed border-muted-foreground/20 rounded-lg bg-background/50 text-center">
                    <p className="text-xs text-muted-foreground/60 font-medium">
                      No tasks
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
