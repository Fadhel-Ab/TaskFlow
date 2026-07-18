import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto, @CurrentUser() user) {
    return this.tasksService.createTask(dto, user.userId);
  }

  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }

  @Get('my')
  getMyTasks(@CurrentUser() user) {
    return this.tasksService.getMyTasks(user.userId);
  }

  @Get(':id/timeline')
  getTimeline(@Param('id') id: string) {
    return this.tasksService.getTimeline(Number(id));
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(Number(id));
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MANAGER')
  assignTask(
    @Param('id') id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user,
  ) {
    return this.tasksService.assignTask(
      Number(id),
      dto.assigneeId,
      user.userId,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user,
  ) {
    return this.tasksService.updateStatus(Number(id), dto.status, user);
  }

  @Patch(':id/action')
  performAction(@Param('id') id: string, @Body() body, @CurrentUser() user) {
    return this.tasksService.performAction(Number(id), body.action, user);
  }
}
