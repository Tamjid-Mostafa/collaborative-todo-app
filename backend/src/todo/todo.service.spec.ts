import { Test, TestingModule } from '@nestjs/testing';
import { TodoAppService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { TodoApp } from './schema/todo.schema';
import { Task } from '../task/schema/task.schema';

describe('TodoAppService', () => {
  let service: TodoAppService;

  const mockTodoModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn().mockResolvedValue([]),
  };

  const mockTaskModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoAppService,
        {
          provide: getModelToken(TodoApp.name),
          useValue: mockTodoModel,
        },
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TodoAppService>(TodoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
