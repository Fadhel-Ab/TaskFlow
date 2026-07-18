import { api } from "./api";

export async function getTaskTimeline(taskId: number) {
  const response = await api.get(`/tasks/${taskId}/timeline`);

  return response.data;
}
