import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoAppService } from './todo.service';
import { TodoAppController } from './todo.controller';
import { TodoApp, TodoAppSchema } from './schema/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TodoApp.name, schema: TodoAppSchema }]),
  ],
  controllers: [TodoAppController],
  providers: [TodoAppService],
  exports: [TodoAppService]
})
export class TodoAppModule {}