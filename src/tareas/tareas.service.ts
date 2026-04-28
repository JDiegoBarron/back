import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './tarea.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareaRepo: Repository<Tarea>,
  ) {}

  async obtenerPorUsuario(usuarioId: number) {
    return await this.tareaRepo.find({
      where: { usuario: { id: usuarioId } },
      order: { fecha_limite: 'ASC' },
    });
  }

  async obtenerProximas(usuarioId: number) {
    return await this.tareaRepo.find({
      where: { usuario: { id: usuarioId }, completada: false },
      order: { fecha_limite: 'ASC' },
      take: 5, // las 5 más próximas
    });
  }

  async crear(usuarioId: number, titulo: string, descripcion: string, fecha_limite: string) {
    const tarea = this.tareaRepo.create({
      titulo,
      descripcion,
      fecha_limite,
      usuario: { id: usuarioId },
    });
    return await this.tareaRepo.save(tarea);
  }

  async completar(id: number) {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    tarea.completada = true;
    return await this.tareaRepo.save(tarea);
  }

  async eliminar(id: number) {
    await this.tareaRepo.delete(id);
    return { mensaje: 'Tarea eliminada' };
  }
}