import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskActivityService } from './task-activity.service';
@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, TaskActivityService],
})
export class TasksModule {}
