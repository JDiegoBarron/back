import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async login(username: string, password: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { username } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    return {
      id: usuario.id,
      username: usuario.username,
      nombre_completo: usuario.nombre_completo,
    };
  }

  async registrar(username: string, password: string, nombre_completo: string) {
    const existe = await this.usuarioRepo.findOne({ where: { username } });
    if (existe) throw new ConflictException('El nombre de usuario ya está en uso');

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const nuevo = this.usuarioRepo.create({ username, password: hash, nombre_completo });
    const guardado = await this.usuarioRepo.save(nuevo);

    return {
      id: guardado.id,
      username: guardado.username,
      nombre_completo: guardado.nombre_completo,
    };
  }
}