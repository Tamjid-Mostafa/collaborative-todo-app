import { Controller, Get, Post, Body, Req, UseGuards, Delete, Param, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoAppService } from './todo.service';

import { TodoAppEntity } from './todo.entity';
import { CreateTodoAppDto } from './dto/create-todo-app.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoAppController {
  constructor(private readonly todoAppService: TodoAppService) {}

  @Post()
  async create(
    @Body() dto: CreateTodoAppDto,
    @Req() req: any,
  ): Promise<TodoAppEntity> {
    return this.todoAppService.create(req.user.userId, dto);
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
}
