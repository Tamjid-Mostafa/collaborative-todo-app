import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TodoAppDocument = TodoApp & Document;

@Schema({ timestamps: true })
export class TodoApp {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  editors: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  viewers: Types.ObjectId[];
}

export const TodoAppSchema = SchemaFactory.createForClass(TodoApp);