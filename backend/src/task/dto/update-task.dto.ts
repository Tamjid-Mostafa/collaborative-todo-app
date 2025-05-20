import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['in-progress', 'completed', 'stale'])
  status?: string;
}
