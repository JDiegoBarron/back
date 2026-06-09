import { Test, TestingModule } from '@nestjs/testing';
import { RachaService } from './racha.service';

describe('RachaService', () => {
  let service: RachaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RachaService],
    }).compile();

    service = module.get<RachaService>(RachaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
