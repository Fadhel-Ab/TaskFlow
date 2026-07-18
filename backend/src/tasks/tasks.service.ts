import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '@prisma/client';
import { allowedTransitions } from './task-workflow';
import { TaskAction } from './task-actions';
import { TaskActivityService } from './task-activity.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private activityService: TaskActivityService,
  ) {}
  async createTask(data: CreateTaskDto, userId: number) {
    const task = await this.prisma.task.create({
      data,
    });

    await this.activityService.create(task.id, userId, 'CREATED');

    return task;
  }

  getTasks() {
    return this.prisma.task.findMany({
      include: {
        assignee: true,
      },
    });
  }

  getTaskById(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
      },
    });
  }
  async assignTask(taskId: number, assigneeId: number, userId: number) {
    const task = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId,
      },
    });

    await this.activityService.create(
      taskId,
      userId,
      `ASSIGNED_TO_${assigneeId}`,
    );

    return task;
  }
  async updateStatus(taskId: number, status: TaskStatus, user) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    const allowed = allowedTransitions[task.status].includes(status);

    if (!allowed) {
      throw new BadRequestException(
        `Cannot move task from ${task.status} to ${status}`,
      );
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });

    await this.activityService.create(
      taskId,
      user.userId,
      `STATUS_CHANGED_TO_${status}`,
    );

    return updatedTask;
  }
  async performAction(taskId: number, action: TaskAction, user) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    let nextStatus: TaskStatus;
    if (
      user.role === 'MEMBER' &&
      ![TaskAction.START, TaskAction.SUBMIT_REVIEW].includes(action)
    ) {
      throw new ForbiddenException('Members cannot perform this action');
    }

    if (
      user.role === 'MANAGER' &&
      ![
        TaskAction.ACCEPT,
        TaskAction.SEND_BACK,
        TaskAction.CANCEL,
        TaskAction.REOPEN,
      ].includes(action)
    ) {
      throw new ForbiddenException('Managers cannot perform this action');
    }

    switch (action) {
      case TaskAction.START:
        nextStatus = TaskStatus.IN_PROGRESS;
        break;

      case TaskAction.SUBMIT_REVIEW:
        nextStatus = TaskStatus.IN_REVIEW;
        break;

      case TaskAction.ACCEPT:
        nextStatus = TaskStatus.DONE;
        break;

      case TaskAction.CANCEL:
        nextStatus = TaskStatus.CANCELLED;
        break;

      case TaskAction.REOPEN:
        nextStatus = TaskStatus.BACKLOG;
        break;

      case TaskAction.SEND_BACK:
        nextStatus = TaskStatus.IN_PROGRESS;
        break;
    }

    return this.updateStatus(taskId, nextStatus, user);
  }

  async getMyTasks(userId: number) {
    return this.prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        assignee: true,
      },
    });
  }

  async getTimeline(taskId: number) {
    return this.prisma.taskActivity.findMany({
      where: {
        taskId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
