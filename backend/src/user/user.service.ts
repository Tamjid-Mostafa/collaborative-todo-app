import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user/user.interface';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Tamjid Hossain',
      email: 'tamjid@example.com',
      password: '12345',
    },
    {
      id: 2,
      name: 'Mostafa Hossain',
      email: 'mostafa@example.com',
      password: '12345',
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345',
    },
  ];
  private idCounter = 2;

  create(userDto: CreateUserDto): User {
    const newUser: User = {
      id: this.idCounter++,
      ...userDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id: number): UserEntity {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return new UserEntity(user);
  }

  findAll(): UserEntity[] {
    return plainToInstance(UserEntity, this.users);
  }
}
