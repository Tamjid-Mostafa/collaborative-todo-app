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
import { TodoGateway } from './todo.gateway';

@Injectable()
export class TodoAppService {
  constructor(
    @InjectModel(TodoApp.name)
    private todoAppModel: Model<TodoAppDocument>,

    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    private readonly todoGateway: TodoGateway,
  ) {}
  private resolveUserRole(
    todo: { owner: any; editors: any[]; viewers: any[] },
    userId: string,
  ): 'owner' | 'editor' | 'viewer' | 'none' {
    const id = userId.toString();

    const normalizeId = (u: any) =>
      typeof u === 'object' && '_id' in u ? u._id.toString() : u?.toString?.();

    if (normalizeId(todo.owner) === id) return 'owner';
    if (todo.editors?.some((u) => normalizeId(u) === id)) return 'editor';
    if (todo.viewers?.some((u) => normalizeId(u) === id)) return 'viewer';

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

    return todoDocs.map((doc) => {
      const plain = doc.toObject();
      const role = this.resolveUserRole(doc, userId);
      return plainToInstance(TodoAppEntity, { ...plain, role });
    });
  }

  async getDetailsWithTasks(todoId: string, userId: string) {
    const todo = await this.todoAppModel
      .findById(todoId)
      .populate('owner editors viewers');

    if (!todo) throw new NotFoundException();
    const role = this.resolveUserRole(todo, userId);
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
  async addCollaborator(
    todoId: string,
    requesterId: string,
    targetUserId: string,
    role: 'editor' | 'viewer',
  ) {
    const todo = await this.todoAppModel.findById(todoId);
    if (!todo) throw new NotFoundException('Todo not found');

    const requesterRole = this.resolveUserRole(todo, requesterId);
    if (requesterRole !== 'owner') {
      throw new ForbiddenException('Only the owner can invite users');
    }

    const targetId = new Types.ObjectId(targetUserId);
    const strTargetId = targetId.toString();

    if (role === 'editor') {
      todo.viewers = todo.viewers.filter((id) => id.toString() !== strTargetId);
      if (!todo.editors.some((id) => id.toString() === strTargetId)) {
        todo.editors.push(targetId);
      }
    } else if (role === 'viewer') {
      todo.editors = todo.editors.filter((id) => id.toString() !== strTargetId);
      if (!todo.viewers.some((id) => id.toString() === strTargetId)) {
        todo.viewers.push(targetId);
      }
    }

    await todo.save();
    this.todoGateway.emitCollaboratorUpdate(targetUserId, {
      userId: targetId,
      role,
    });
  }

  async deleteIfOwner(todoId: string, userId: string): Promise<boolean> {
    const todo = await this.todoAppModel.findById(todoId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    const role = this.resolveUserRole(todo, userId);
    if (role !== 'owner') throw new ForbiddenException();
    await this.todoAppModel.findByIdAndDelete(todoId);

    const allUserIds = [
      ...todo.editors.map((id) => id.toString()),
      ...todo.viewers.map((id) => id.toString()),
    ];

    this.todoGateway.emitTodoDeleted(allUserIds, todoId);

    return true;
  }
}
