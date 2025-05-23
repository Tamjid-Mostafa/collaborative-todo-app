import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoAppService } from './todo.service';

import { TodoAppEntity } from './todo.entity';
import { CreateTodoAppDto } from './dto/create-todo-app.dto';
import { UserService } from 'src/user/user.service';
import { Types } from 'mongoose';
import { UserEntity } from 'src/user/user.entity';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoAppController {
  constructor(
    private readonly userService: UserService,
    private readonly todoAppService: TodoAppService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateTodoAppDto,
    @Req() req: any,
  ): Promise<TodoAppEntity> {
    return this.todoAppService.create(req.user.userId, dto);
  }

  @Get(':id/details')
  async getDetails(@Param('id') id: string, @Req() req: any) {
    return this.todoAppService.getDetailsWithTasks(id, req.user.userId);
  }

  @Get()
  async findAllForUser(@Req() req: any): Promise<TodoAppEntity[]> {
    console.log('User', req.user);
    return this.todoAppService.findAllForUser(req.user.userId);
  }

  @Delete(':id')
  async deleteTodoApp(@Param('id') id: string, @Req() req: any) {
    const success = await this.todoAppService.deleteIfOwner(
      id,
      req.user.userId,
    );
    if (!success) {
      throw new ForbiddenException('Only the owner can delete this Todo App');
    }
    return { message: 'Deleted successfully' };
  }

  @Post(':id/invite')
  async inviteUser(
    @Param('id') todoId: string,
    @Body() dto: { userId: string; role: 'editor' | 'viewer' },
    @Req() req: any,
  ) {
    const todo = await this.todoAppService.findTodoById(todoId);
    if (!todo) throw new NotFoundException('Todo not found');
  
    if (todo.owner.toString() !== req.user.userId) {
      throw new ForbiddenException('Only the owner can invite users');
    }
  
    const userIdObj = new Types.ObjectId(dto.userId);
  
    const editors = todo.editors.map(id => id.toString());
    const viewers = todo.viewers.map(id => id.toString());
    const userIdStr = userIdObj.toString();
  
    if (dto.role === 'editor') {
      todo.viewers = todo.viewers.filter(id => id.toString() !== userIdStr);
      if (!editors.includes(userIdStr)) {
        todo.editors.push(userIdObj);
      }
    }
  
    if (dto.role === 'viewer') {
      todo.editors = todo.editors.filter(id => id.toString() !== userIdStr);
      if (!viewers.includes(userIdStr)) {
        todo.viewers.push(userIdObj);
      }
    }
  
    await todo.save();
    return { message: 'User invited' };
  }
  
}
