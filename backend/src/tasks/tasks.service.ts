import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '@prisma/client';
import { allowedTransitions } from './task-workflow';

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
}
