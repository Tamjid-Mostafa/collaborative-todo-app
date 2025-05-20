import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user/user.interface';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';


@Injectable()
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  create(userDto: CreateUserDto): User {
    const newUser: User = {
      id: this.idCounter++,
      ...userDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }
}
