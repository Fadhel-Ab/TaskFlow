import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Patch } from '@nestjs/common';
import { AssignTaskDto } from './dto/assign-task.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskActionDto } from './dto/task-action.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyTasks(@CurrentUser() user) {
    return this.tasksService.getMyTasks(user.id);
  }
  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(Number(id));
  }
  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MANAGER')
  assignTask(@Param('id') id: string, @Body() dto: AssignTaskDto) {
    return this.tasksService.assignTask(Number(id), dto.assigneeId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(Number(id), dto.status);
  }
  @Patch(':id/action')
  @UseGuards(JwtAuthGuard)
  performAction(
    @Param('id') id: string,
    @Body() dto: TaskActionDto,
    @CurrentUser() user,
  ) {
    return this.tasksService.performAction(Number(id), dto.action, user);
  }
}
