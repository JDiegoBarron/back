import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CosmeticosService } from './cosmeticos.service';
import { ActivarCosmeticoDto, ComprarCosmeticoDto } from './cosmetico.dto';

@Controller('cosmeticos')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class CosmeticosController {
  constructor(private readonly cosmeticosService: CosmeticosService) {}

  @Get('usuario/:userId')
  obtenerParaUsuario(@Param('userId', ParseIntPipe) userId: number) {
    return this.cosmeticosService.obtenerParaUsuario(userId);
  }

  @Post('comprar')
  comprar(@Body() dto: ComprarCosmeticoDto) {
    return this.cosmeticosService.comprar(dto);
  }

  @Put('activar')
  activar(@Body() dto: ActivarCosmeticoDto) {
    return this.cosmeticosService.activar(dto);
  }
}