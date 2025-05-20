import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoAppService } from './todo-app.service';
import { CreateTodoAppDto } from './dto/create-todo-app.dto';
import { TodoAppEntity } from './todo-app.entity';

@Controller('todo-apps')
@UseGuards(JwtAuthGuard)

export class TodoAppController {
  constructor(private readonly todoAppService: TodoAppService) {}

  @Post()
  async create(@Body() dto: CreateTodoAppDto, @Req() req: any): Promise<TodoAppEntity> {
    return this.todoAppService.create(req.user.userId, dto);
  }

  @Get()
  async findAllForUser(@Req() req: any): Promise<TodoAppEntity[]> {
    console.log("User",req.user);
    return this.todoAppService.findAllForUser(req.user.userId);
  }
}