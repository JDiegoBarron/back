import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RachaController } from './racha.controller';
import { RachaService } from './racha.service';
import { Usuario } from 'src/auth/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
  ],
  controllers: [RachaController],
  providers:   [RachaService],
  exports:     [RachaService], 
})
export class RachaModule {}