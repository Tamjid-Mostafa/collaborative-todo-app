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
    @Body() dto: { email: string; role: 'editor' | 'viewer' },
    @Req() req: any,
  ) {
    const todo = await this.todoAppService.findTodoById(todoId);
    if (!todo) throw new NotFoundException('Todo not found');

    if (todo.owner.toString() !== req.user.userId) {
      throw new ForbiddenException('Only the owner can invite users');
    }

    const res = await this.userService.findByEmail(dto.email);
    const user = new UserEntity(res?.toObject() as Partial<UserEntity>);
    if (!user) throw new NotFoundException('User not found');
    const userId = new Types.ObjectId(user._id);

    if (dto.role === 'editor' && !todo.editors.includes(userId)) {
      todo.editors.push(userId);
    }

    if (dto.role === 'viewer' && !todo.viewers.includes(userId)) {
      todo.viewers.push(userId);
    }

    await todo.save();
    return { message: 'User invited' };
  }
}
