import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

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
    return new TaskEntity(created.toObject() as unknown as Partial<TaskEntity>);
  }

  async findAll(todoAppId: string): Promise<TaskEntity[]> {
    const tasks = await this.taskModel.find({ todoApp: todoAppId });
    return tasks.map(
      (task) =>
        new TaskEntity(task.toObject() as unknown as Partial<TaskEntity>),
    );
  }

  async update(taskId: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);
    const updated = await task.save();
    return new TaskEntity(updated.toObject() as unknown as Partial<TaskEntity>);
  }

  async delete(taskId: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(taskId);
    if (!result) throw new NotFoundException('Task not found');
  }
}
