import { IsString, IsIn, IsOptional } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['pending', 'in-progress', 'completed'])
  status: 'pending' | 'in-progress' | 'completed';

  @IsString()
  appId: string;
}