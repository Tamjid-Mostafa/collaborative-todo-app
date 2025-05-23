import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './task.entity';
import { plainToInstance } from 'class-transformer';
import { TaskGateway } from './task.gateway';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly taskGateway: TaskGateway,
  ) {}

  async create(
    todoAppId: string,
    userId: string,
    dto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const created = await this.taskModel.create({
      ...dto,
      todoApp: new Types.ObjectId(todoAppId),
      createdBy: new Types.ObjectId(userId),
    });
    this.taskGateway.emitTaskUpdate(todoAppId, {
      type: 'created',
      task: new TaskEntity(
        created.toObject() as unknown as Partial<TaskEntity>,
      ),
    });
    return new TaskEntity(created.toObject() as unknown as Partial<TaskEntity>);
  }

  async findAll(todoAppId: string): Promise<TaskEntity[]> {
    const tasks = await this.taskModel.find({
      todoApp: new Types.ObjectId(todoAppId),
    });

    const plain = tasks.map((task) => task.toObject());
    return plainToInstance(TaskEntity, plain);
  }

  async update(taskId: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);
    const updated = await task.save();
    this.taskGateway.emitTaskUpdate(task.todoApp.toString(), {
      type: 'updated',
      task: new TaskEntity(
        updated.toObject() as unknown as Partial<TaskEntity>,
      ),
    });
    return new TaskEntity(updated.toObject() as unknown as Partial<TaskEntity>);
  }

  async delete(taskId: string): Promise<void> {
    const task = await this.taskModel.findByIdAndDelete(taskId);
    this.taskGateway.emitTaskUpdate(task?.todoApp.toString()!, {
      type: 'deleted',
      taskId,
    });

    if (!task) throw new NotFoundException('Task not found');
  }
}
