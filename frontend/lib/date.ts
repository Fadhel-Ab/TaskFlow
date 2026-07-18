export function isOverdue(dueDate: string, status: string) {
  const date = new Date(dueDate);

  return date < new Date() && status !== "DONE" && status !== "CANCELLED";
}
