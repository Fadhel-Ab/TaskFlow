"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();

  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    async function loadTask() {
      const response = await api.get(`/tasks/${params.id}`);

      setTask(response.data);
    }

    loadTask();
  }, [params.id]);

  if (!task) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="p-6">
      <Card className="p-6 space-y-3">
        <h1 className="text-2xl font-bold">{task.title}</h1>

        <p>{task.description}</p>

        <p>Status: {task.status}</p>

        <p>Priority: {task.priority}</p>
      </Card>
    </main>
  );
}
