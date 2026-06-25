import { Module } from '@nestjs/common';
import { CuestionarioService } from './cuestionario.service';
import { CuestionarioController } from './cuestionario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaCuestionario } from './entities/respuesta-cuestionario.entity';
import { UltimaRespuestaSeccion } from './entities/ultima-respuesta-seccion.entity';
import { Seccion } from 'src/secciones/seccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seccion, RespuestaCuestionario, UltimaRespuestaSeccion])],
  controllers: [CuestionarioController],
  providers: [CuestionarioService],
})
export class CuestionarioModule {}