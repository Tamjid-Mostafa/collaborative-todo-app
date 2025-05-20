import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly role: string;
  readonly email: string;
  readonly password: string;
}
