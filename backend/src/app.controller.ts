import { Controller, Get, Param, ParseIntPipe, Post, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    // Now `id` is guaranteed to be a number
    return `User ID is ${id}`;
  }
  
}
