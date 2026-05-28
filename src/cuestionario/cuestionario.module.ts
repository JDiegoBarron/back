import { Module } from '@nestjs/common';
import { CuestionarioService } from './cuestionario.service';
import { CuestionarioController } from './cuestionario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuestionario } from './entities/cuestionario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuestionario])],
  controllers: [CuestionarioController],
  providers: [CuestionarioService],
})
export class CuestionarioModule {}
