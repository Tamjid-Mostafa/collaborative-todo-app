import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('todo-apps/:todoAppId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Param('todoAppId') appId: string, @Req() req: any, @Body() dto: CreateTaskDto) {
    return this.taskService.create(appId, req.user.userId, dto);
  }

  @Get()
  findAll(@Param('todoAppId') appId: string) {
    return this.taskService.findAll(appId);
  }

  @Patch(':taskId')
  update(@Param('taskId') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Delete(':taskId')
  delete(@Param('taskId') id: string) {
    return this.taskService.delete(id);
  }
}
