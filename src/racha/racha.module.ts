import { Module } from '@nestjs/common';
import { RachaService } from './racha.service';
import { RachaController } from './racha.controller';

@Module({
  controllers: [RachaController],
  providers: [RachaService],
})
export class RachaModule {}
