import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { PerfilService } from './perfil.service';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get(':usuarioId')
  obtener(@Param('usuarioId') usuarioId: string) {
    return this.perfilService.obtener(+usuarioId);
  }

  @Put(':usuarioId')
  guardar(
    @Param('usuarioId') usuarioId: string,
    @Body() body: { correo: string; carrera: string; semestre: number },
  ) {
    return this.perfilService.guardar(+usuarioId, body.correo, body.carrera, body.semestre);
  }
}