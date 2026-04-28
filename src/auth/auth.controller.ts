import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('registrar')
  registrar(@Body() body: { username: string; password: string; nombre_completo: string }) {
    return this.authService.registrar(body.username, body.password, body.nombre_completo);
  }
}