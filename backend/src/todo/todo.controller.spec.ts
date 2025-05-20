import { Test, TestingModule } from '@nestjs/testing';
import { TodoAppController } from './todo.controller';
import { TodoAppService } from './todo.service';


describe('TodoAppController', () => {
  let controller: TodoAppController;

  const mockTodoAppService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoAppController],
      providers: [
        {
          provide: TodoAppService,
          useValue: mockTodoAppService,
        },
      ],
    }).compile();

    controller = module.get<TodoAppController>(TodoAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
