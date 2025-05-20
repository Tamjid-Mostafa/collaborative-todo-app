import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(dto);
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
