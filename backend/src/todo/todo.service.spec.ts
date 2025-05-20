import { Test, TestingModule } from '@nestjs/testing';
import { TodoAppService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { TodoApp } from './schema/todo.schema';

describe('TodoAppService', () => {
  let service: TodoAppService;

  const mockModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoAppService,
        {
          provide: getModelToken(TodoApp.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<TodoAppService>(TodoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
