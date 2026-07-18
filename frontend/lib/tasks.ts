import { api } from "./api";
import { Task } from "@/types/task";

export async function getTasks(): Promise<Task[]> {
  const response = await api.get("/tasks");

  return response.data;
}
