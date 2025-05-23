import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class TodoAppEntity {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => value.toString())
  owner: string;

  @Expose()
  @Transform(({ value }) => value.map((id: Types.ObjectId) => id.toString()))
  editors: string[];

  @Expose()
  @Transform(({ value }) => value.map((id: Types.ObjectId) => id.toString()))
  viewers: string[];

  constructor(partial: Partial<TodoAppEntity>) {
    Object.assign(this, partial);
  }
}
