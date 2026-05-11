import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CuestionarioService } from './cuestionario.service';

@Controller('cuestionario')
export class CuestionarioController {
  constructor(private readonly cuestionarioService: CuestionarioService) {}

  @Post()
  guardar(@Body() body: { usuarioId: number; respuestas: { pregunta: number; valor: number }[] }) {
    return this.cuestionarioService.guardar(body.usuarioId, body.respuestas);
  }

  @Get('usuario/:usuarioId')
  obtenerTodos(@Param('usuarioId') usuarioId: string) {
    return this.cuestionarioService.obtenerPorUsuario(+usuarioId);
  }

  @Get('usuario/:usuarioId/ultimo')
  obtenerUltimo(@Param('usuarioId') usuarioId: string) {
    return this.cuestionarioService.obtenerUltimo(+usuarioId);
  }
}