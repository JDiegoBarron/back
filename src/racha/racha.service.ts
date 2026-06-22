import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/usuario.entity';
import { Repository } from 'typeorm';

export interface RachaResponse {
  rachaActual:    number;
  mejorRacha:     number;
  monedasGanadas: number;
  monedasTotal:   number;
  loginNuevo:     boolean;
}

@Injectable()
export class RachaService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  private calcularRecompensa(rachaActual: number): number {
    if (rachaActual >= 14) return 40;
    if (rachaActual >= 7)  return 25;
    if (rachaActual >= 3)  return 15;
    return 10; // 1-2 días
  }

  private hoyStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private ayerStr(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  async registrarLogin(userId: number): Promise<RachaResponse> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: userId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const hoy  = this.hoyStr();
    const ayer = this.ayerStr();

    if (usuario.ultimoLogin === hoy) {
      return {
        rachaActual:    usuario.rachaActual,
        mejorRacha:     usuario.mejorRacha,
        monedasGanadas: 0,
        monedasTotal:   usuario.monedas,
        loginNuevo:     false,
      };
    }

    let nuevaRacha: number;
    if (usuario.ultimoLogin === ayer) {
      nuevaRacha = usuario.rachaActual + 1;
    } else {
      nuevaRacha = 1;
    }

    const monedasGanadas = this.calcularRecompensa(nuevaRacha);
    const nuevaMejorRacha = Math.max(usuario.mejorRacha, nuevaRacha);

    usuario.rachaActual = nuevaRacha;
    usuario.mejorRacha  = nuevaMejorRacha;
    usuario.monedas    += monedasGanadas;
    usuario.ultimoLogin = hoy;
    await this.usuarioRepo.save(usuario);

    return {
      rachaActual:    nuevaRacha,
      mejorRacha:     nuevaMejorRacha,
      monedasGanadas: monedasGanadas,
      monedasTotal:   usuario.monedas + monedasGanadas,
      loginNuevo:     true,
    };
  }

  async obtenerRacha(userId: number): Promise<RachaResponse> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: userId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return {
      rachaActual:    usuario.rachaActual,
      mejorRacha:     usuario.mejorRacha,
      monedasGanadas: 0,
      monedasTotal:   usuario.monedas,
      loginNuevo:     false,
    };
  }
}