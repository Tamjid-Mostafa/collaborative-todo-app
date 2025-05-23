import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TodoApp, TodoAppDocument } from './schema/todo.schema';

import { TodoAppEntity } from './todo.entity';
import { plainToInstance } from 'class-transformer';
import { CreateTodoAppDto } from './dto/create-todo-app.dto';

@Injectable()
export class TodoAppService {
  constructor(
    @InjectModel(TodoApp.name)
    private todoAppModel: Model<TodoAppDocument>,
  ) {}

  async create(ownerId: string, dto: CreateTodoAppDto): Promise<TodoAppEntity> {
    const created = await this.todoAppModel.create({
      ...dto,
      owner: new Types.ObjectId(ownerId),
    });

    return new TodoAppEntity(created.toObject() as unknown as Partial<TodoAppEntity>);

  }

  async findAllForUser(userId: string): Promise<TodoAppEntity[]> {
    const objectId = new Types.ObjectId(userId);
  
    const todoDocs = await this.todoAppModel.find({
      $or: [
        { owner: objectId },
        { editors: objectId },
        { viewers: objectId },
      ],
    });
  
    const plain = todoDocs.map((doc) => doc.toObject());
    return plainToInstance(TodoAppEntity, plain);
  }


  async deleteIfOwner(todoId: string, userId: string): Promise<boolean> {
    const todo = await this.todoAppModel.findById(todoId);
    if (!todo) {
      throw new NotFoundException("Todo not found");
    }

    if (todo.owner.toString() !== userId.toString()) {
      return false;
    }
  
    await this.todoAppModel.findByIdAndDelete(todoId);
    return true;
  }
  
}
