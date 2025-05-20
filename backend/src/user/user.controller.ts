import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user/user.interface';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: string): UserEntity {
    return this.userService.getUserById(+id);
  }

  @Get()
  getAllUsers(): User[] {
    return this.userService.findAll();
  }
}
