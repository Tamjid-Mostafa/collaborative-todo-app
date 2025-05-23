import { Exclude, Expose, Transform } from 'class-transformer';
import { TaskPriority } from './priority.enum';

export class TaskEntity {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  title: string;

  @Expose()
  status: string;

  @Expose()
  dueDate?: Date;

  @Expose()
  priority?: TaskPriority;

  @Transform(({ value }) => value?.toString())
  @Expose()
  todoApp: string;

  @Transform(({ value }) => value?.toString())
  @Expose()
  createdBy: string;

  @Exclude()
  __v?: number;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
