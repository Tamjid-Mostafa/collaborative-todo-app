import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsIn(['in-progress', 'completed', 'stale'])
  status?: string; 
}
