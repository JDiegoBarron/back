import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { TareasService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get('usuario/:usuarioId')
  obtenerPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.tareasService.obtenerPorUsuario(+usuarioId);
  }

  @Get('proximas/:usuarioId')
  obtenerProximas(@Param('usuarioId') usuarioId: string) {
    return this.tareasService.obtenerProximas(+usuarioId);
  }

  @Post()
  crear(
    @Body()
    body: {
      usuarioId: number;
      titulo: string;
      descripcion: string;
      fecha_limite: string;
      categoria: string;
      prioridad: string;
      dificultad: number;
    },
  ) {
    return this.tareasService.crear(
      body.usuarioId,
      body.titulo,
      body.descripcion,
      body.fecha_limite,
      body.categoria,
      body.prioridad,
      body.dificultad,
    );
  }

  @Put(':id')
  editar(
    @Param('id') id: string,
    @Body()
    body: {
      titulo: string;
      descripcion: string;
      fecha_limite: string;
      categoria: string;
      prioridad: string;
      dificultad: number;
    },
  ) {
    return this.tareasService.editar(
      +id,
      body.titulo,
      body.descripcion,
      body.fecha_limite,
      body.categoria,
      body.prioridad,
      body.dificultad,
    );
  }

  @Put(':id/completar')
  completar(@Param('id') id: string) {
    return this.tareasService.completar(+id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.tareasService.eliminar(+id);
  }
}