// cuestionario/cuestionario.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CuestionarioService } from './cuestionario.service';

@Controller('cuestionario')
export class CuestionarioController {
  constructor(private readonly cuestionarioService: CuestionarioService) {}

  @Get('usuario/:usuarioId/estado')
  obtenerEstado(@Param('usuarioId') usuarioId: string) {
    return this.cuestionarioService.obtenerEstadoCompleto(+usuarioId);
  }

  @Post()
  guardar(@Body() body: { usuarioId: number; respuestasPorSeccion: Record<string, { pregunta: number; valor: number }[]> }) {
    return this.cuestionarioService.guardar(body.usuarioId, body.respuestasPorSeccion);
  }
}