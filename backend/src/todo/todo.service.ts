import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TodoApp, TodoAppDocument } from './schema/todo.schema';

import { TodoAppEntity } from './todo.entity';
import { plainToInstance } from 'class-transformer';
import { CreateTodoAppDto } from './dto/create-todo-app.dto';
import { Task, TaskDocument } from '../task/schema/task.schema';
import { TaskEntity } from '../task/task.entity';
import { PopulatedTodoAppEntity } from './populated.entity';

@Injectable()
export class TodoAppService {
  constructor(
    @InjectModel(TodoApp.name)
    private todoAppModel: Model<TodoAppDocument>,

    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}
  private getUserRole(
    todo: { owner: any; editors: any[]; viewers: any[] },
    userId: string,
  ): 'owner' | 'editor' | 'viewer' | 'none' {
    const id = userId.toString();

    if (todo.owner?._id?.toString() === id) return 'owner';
    if (todo.editors?.some((u) => u._id?.toString() === id)) return 'editor';
    if (todo.viewers?.some((u) => u._id?.toString() === id)) return 'viewer';

    return 'none';
  }

  async create(ownerId: string, dto: CreateTodoAppDto): Promise<TodoAppEntity> {
    const created = await this.todoAppModel.create({
      ...dto,
      owner: new Types.ObjectId(ownerId),
    });

    return new TodoAppEntity(
      created.toObject() as unknown as Partial<TodoAppEntity>,
    );
  }

  async findAllForUser(userId: string): Promise<TodoAppEntity[]> {
    const objectId = new Types.ObjectId(userId);

    const todoDocs = await this.todoAppModel.find({
      $or: [{ owner: objectId }, { editors: objectId }, { viewers: objectId }],
    });

    const plain = todoDocs.map((doc) => doc.toObject());
    return plainToInstance(TodoAppEntity, plain);
  }
  async getDetailsWithTasks(todoId: string, userId: string) {
    const todo = await this.todoAppModel
      .findById(todoId)
      .populate('owner editors viewers');

    if (!todo) throw new NotFoundException();
    const role = this.getUserRole(todo, userId);
    console.log(role);
    if (role === 'none') throw new ForbiddenException();

    const tasks = await this.taskModel.find({
      todoApp: new Types.ObjectId(todoId),
    });

    return {
      todoApp: plainToInstance(PopulatedTodoAppEntity, todo.toObject()),
      tasks: plainToInstance(
        TaskEntity,
        tasks.map((t) => t.toObject()),
      ),
      role,
    };
  }

  async deleteIfOwner(todoId: string, userId: string): Promise<boolean> {
    const todo = await this.todoAppModel.findById(todoId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.owner.toString() !== userId.toString()) {
      return false;
    }

    await this.todoAppModel.findByIdAndDelete(todoId);
    return true;
  }

  async findTodoById(todoId: string) {
    const todo = await this.todoAppModel.findById(todoId);
    return todo;
  }
}
