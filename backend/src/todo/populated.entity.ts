import { Expose, Transform, Type } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';

export class PopulatedTodoAppEntity {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => UserEntity)
  owner: UserEntity;

  @Expose()
  @Type(() => UserEntity)
  editors: UserEntity[];

  @Expose()
  @Type(() => UserEntity)
  viewers: UserEntity[];
}
