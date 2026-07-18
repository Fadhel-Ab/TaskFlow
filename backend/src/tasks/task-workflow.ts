import { TaskStatus } from '@prisma/client';

export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  BACKLOG: [TaskStatus.ASSIGNED, TaskStatus.CANCELLED],

  ASSIGNED: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],

  IN_PROGRESS: [TaskStatus.IN_REVIEW, TaskStatus.CANCELLED],

  IN_REVIEW: [TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],

  DONE: [
    TaskStatus.IN_PROGRESS, // reopen
  ],

  CANCELLED: [
    TaskStatus.BACKLOG, // reopen
  ],
};
