import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoAppService } from './todo.service';
import { TodoAppController } from './todo.controller';
import { TodoApp, TodoAppSchema } from './schema/todo.schema';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';
import { TodoGateway } from './todo.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TodoApp.name, schema: TodoAppSchema }]),
    UserModule,
    TaskModule
  ],
  controllers: [TodoAppController],
  providers: [TodoAppService, TodoGateway],
  exports: [TodoAppService]
})
export class TodoAppModule {}