import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, [] as const),
) {
  @IsDateString()
  @IsOptional()
  completed_at?: Date;
}
