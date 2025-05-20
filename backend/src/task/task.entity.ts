import { Exclude, Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class TaskEntity {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  title: string;

  @Expose()
  status: string;

  @Expose()
  dueDate?: Date;

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
