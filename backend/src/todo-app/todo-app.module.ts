import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoApp, TodoAppSchema } from './schema/todo-app.schema';
import { TodoAppService } from './todo-app.service';
import { TodoAppController } from './todo-app.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TodoApp.name, schema: TodoAppSchema }]),
  ],
  controllers: [TodoAppController],
  providers: [TodoAppService],
  exports: [TodoAppService]
})
export class TodoAppModule {}