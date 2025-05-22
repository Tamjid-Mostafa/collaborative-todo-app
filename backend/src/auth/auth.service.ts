import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    // Check if email already exists
    const existingByEmail = await this.userService.findByEmail(dto.email);
    if (existingByEmail) {
      throw new ConflictException('Email already in use');
    }

    // Optional: check username uniqueness
    const existingByUsername = await this.userService.findByUsername?.(
      dto.username,
    );
    if (existingByUsername) {
      throw new ConflictException('Username already taken');
    }

    // Strip passwordConfirm from dto before saving
    const { passwordConfirm, ...safeDto } = dto;
    console.log({dto});
    // Hash the password
    const hashedPassword = await bcrypt.hash(safeDto.password, 10);

    // Create user
    const user = await this.userService.create({
      ...safeDto,
      passwordConfirm,
      password: hashedPassword,
    });

    // Create JWT payload
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    // Return user + access_token
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
