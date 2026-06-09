import { Test, TestingModule } from '@nestjs/testing';
import { RachaController } from './racha.controller';
import { RachaService } from './racha.service';

describe('RachaController', () => {
  let controller: RachaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RachaController],
      providers: [RachaService],
    }).compile();

    controller = module.get<RachaController>(RachaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
