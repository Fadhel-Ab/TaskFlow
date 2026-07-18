"use client";
import { Card } from "@/components/ui/card";
import { TaskStatus } from "@/types/task";
import { useEffect, useState } from "react";
import { getTasks } from "@/lib/tasks";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/tasks/task-card";
const columns = [
  {
    title: "Backlog",
    status: TaskStatus.BACKLOG,
  },
  {
    title: "Assigned",
    status: TaskStatus.ASSIGNED,
  },
  {
    title: "In Progress",
    status: TaskStatus.IN_PROGRESS,
  },
  {
    title: "In Review",
    status: TaskStatus.IN_REVIEW,
  },
  {
    title: "Done",
    status: TaskStatus.DONE,
  },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">TaskFlow Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map((column) => (
          <div key={column.status}>
            <h2 className="font-semibold mb-3">{column.title}</h2>

            <Card className="p-4 min-h-[200px]">
              {tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
