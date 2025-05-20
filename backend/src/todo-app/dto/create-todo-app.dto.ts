import { IsString } from 'class-validator';

export class CreateTodoAppDto {
  @IsString()
  name: string;
}
