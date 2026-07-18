import { api } from "./api";

export async function performTaskAction(taskId: number, action: string) {
  const response = await api.patch(`/tasks/${taskId}/action`, {
    action,
  });

  return response.data;
}
