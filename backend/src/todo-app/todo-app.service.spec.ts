import { Test, TestingModule } from '@nestjs/testing';
import { TodoAppService } from './todo-app.service';

describe('TodoAppService', () => {
  let service: TodoAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoAppService],
    }).compile();

    service = module.get<TodoAppService>(TodoAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
