import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { RachaService } from './racha.service';

@Controller('racha')
export class RachaController {
  constructor(private readonly rachaService: RachaService) {}

  @Post('registro/:userId')
  registrarLogin(@Param('userId', ParseIntPipe) userId: number) {
    return this.rachaService.registrarLogin(userId);
  }

  @Get(':userId')
  obtenerRacha(@Param('userId', ParseIntPipe) userId: number) {
    return this.rachaService.obtenerRacha(userId);
  }
}