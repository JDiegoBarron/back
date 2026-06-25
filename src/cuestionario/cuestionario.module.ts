import { Module } from '@nestjs/common';
import { CuestionarioService } from './cuestionario.service';
import { CuestionarioController } from './cuestionario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuestionario } from './entities/cuestionario.entity';
import { RespuestaCuestionario } from './entities/respuesta-cuestionario.entity';
import { UltimaRespuestaSeccion } from './entities/ultima-respuesta-seccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuestionario, RespuestaCuestionario, UltimaRespuestaSeccion])],
  controllers: [CuestionarioController],
  providers: [CuestionarioService],
})
export class CuestionarioModule {}
