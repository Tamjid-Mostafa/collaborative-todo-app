import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.signup(dto);

    // res.cookie('access_token', access_token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: 1000 * 60 * 60 * 24 * 7
    // });

    return response;
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(
      body.email,
      body.password,
    );

    // res.cookie('access_token', access_token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: 1000 * 60 * 60 * 24 * 7
    // });
    return response;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
