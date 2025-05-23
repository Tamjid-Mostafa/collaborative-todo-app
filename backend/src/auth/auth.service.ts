import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { UserService } from '../user/user.service';
  import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from 'src/user/user.entity';
  
  @Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.userService.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ ...dto, password: hashed });

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(email: string, password: string) {
    const userDoc = await this.userService.findByEmail(email);
    if (!userDoc) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: userDoc._id, email: userDoc.email };
    return {
      user: new UserEntity(userDoc.toObject() as Partial<UserEntity>),
      access_token: this.jwtService.sign(payload),
    };
  }
}
