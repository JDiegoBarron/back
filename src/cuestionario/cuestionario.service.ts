import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuestionario } from './entities/cuestionario.entity';

interface RespuestaDto {
  pregunta: number;
  valor: number;
}

@Injectable()
export class CuestionarioService {
  constructor(
    @InjectRepository(Cuestionario)
    private cuestionarioRepo: Repository<Cuestionario>,
  ) {}

  async guardar(usuarioId: number, respuestas: RespuestaDto[]) {
    // Convertir array [{ pregunta: 1, valor: 3 }, ...] a objeto { p1: 3, ... }
    const datos: Partial<Cuestionario> = {
      usuario: { id: usuarioId } as any,
    };

    for (const r of respuestas) {
      const clave = `p${r.pregunta}` as keyof Cuestionario;
      (datos as any)[clave] = r.valor;
    }

    const nuevo = this.cuestionarioRepo.create(datos);
    return await this.cuestionarioRepo.save(nuevo);
  }

  async obtenerPorUsuario(usuarioId: number) {
    return await this.cuestionarioRepo.find({
      where: { usuario: { id: usuarioId } },
      order: { fecha: 'DESC' }, // el más reciente primero
    });
  }

  async obtenerUltimo(usuarioId: number) {
    return await this.cuestionarioRepo.findOne({
      where: { usuario: { id: usuarioId } },
      order: { fecha: 'DESC' },
    });
  }
}