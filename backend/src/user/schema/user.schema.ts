import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export enum UserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer',
  EDITOR = 'editor',
}
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;

  @Prop({ enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
