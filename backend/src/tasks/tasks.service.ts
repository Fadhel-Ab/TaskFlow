import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

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
}
