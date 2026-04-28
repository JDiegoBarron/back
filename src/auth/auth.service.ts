import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async login(username: string, password: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { username, password } });
    if (!usuario) throw new UnauthorizedException('Usuario o contraseña incorrectos');
    return {
      id: usuario.id,
      username: usuario.username,
      nombre_completo: usuario.nombre_completo,
    };
  }

  async registrar(username: string, password: string, nombre_completo: string) {
    const nuevo = this.usuarioRepo.create({ username, password, nombre_completo });
    return await this.usuarioRepo.save(nuevo);
  }
}