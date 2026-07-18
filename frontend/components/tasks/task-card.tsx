import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { isOverdue } from "@/lib/date";
import { useRouter } from "next/navigation";

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter();
  return (
    <Card
      className="p-4 space-y-3 cursor-pointer hover:shadow-md"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{task.title}</h3>

        <div className="flex gap-2">
          <Badge>{task.priority}</Badge>

          <Badge variant="outline">{task.status}</Badge>

          {isOverdue(task.dueDate, task.status) && (
            <Badge variant="destructive">Overdue</Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{task.category}</p>

      <p className="text-xs">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>
    </Card>
  );
}
