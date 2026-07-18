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

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  createTask(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
    });
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
  assignTask(taskId: number, assigneeId: number) {
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId,
      },
      include: {
        assignee: true,
      },
    });
  }
  async updateStatus(taskId: number, status: TaskStatus) {
    return this.prisma.task
      .findUnique({
        where: {
          id: taskId,
        },
      })
      .then((task) => {
        if (!task) {
          throw new BadRequestException('Task not found');
        }

        const allowed = allowedTransitions[task.status].includes(status);

        if (!allowed) {
          throw new BadRequestException(
            `Cannot move task from ${task.status} to ${status}`,
          );
        }

        return this.prisma.task.update({
          where: {
            id: taskId,
          },
          data: {
            status,
          },
        });
      });
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

    return this.updateStatus(taskId, nextStatus);
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
}
