import { IsEnum } from 'class-validator';
import { TaskAction } from '../task-actions';

export class TaskActionDto {
  @IsEnum(TaskAction)
  action: TaskAction;
}
