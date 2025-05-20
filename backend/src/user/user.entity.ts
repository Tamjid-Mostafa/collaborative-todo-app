import { Exclude, Expose, Transform } from 'class-transformer';

export class UserEntity {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString())
  _id: string;
  name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
