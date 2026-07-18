import { IsDateString, IsOptional, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsDateString()
  dueDate: string;

  @IsEnum(Priority)
  priority: Priority;
}
