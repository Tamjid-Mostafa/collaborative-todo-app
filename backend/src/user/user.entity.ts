import { Exclude, Expose, Transform } from 'class-transformer';

export class UserEntity {
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
