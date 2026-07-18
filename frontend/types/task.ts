export enum TaskStatus {
  BACKLOG = "BACKLOG",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  category: string;
  dueDate: string;
  status: TaskStatus;
}
