import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskActivityService {
  constructor(private prisma: PrismaService) {}

  create(taskId: number, userId: number, action: string) {
    return this.prisma.taskActivity.create({
      data: {
        taskId,
        userId,
        action,
      },
    });
  }
}
