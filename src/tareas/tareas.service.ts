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

  private conVencida(tarea: Tarea): Tarea & { vencida: boolean } {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = tarea.fecha_limite ? new Date(tarea.fecha_limite) : null;
    const vencida = !tarea.completada && limite !== null && limite < hoy;
    return { ...tarea, vencida };
  }

  async obtenerPorUsuario(usuarioId: number) {
    const tareas = await this.tareaRepo.find({
      where: { usuario: { id: usuarioId } },
      order: { fecha_limite: 'ASC' },
    });
    return tareas.map(t => this.conVencida(t));
  }

  async obtenerProximas(usuarioId: number) {
    const tareas = await this.tareaRepo.find({
      where: { usuario: { id: usuarioId }, completada: false },
      order: { fecha_limite: 'ASC' },
      // Se eliminó el límite arbitrario de 5 — el cliente decide cuántas mostrar
    });
    return tareas.map(t => this.conVencida(t));
  }

  async crear(
    usuarioId: number,
    titulo: string,
    descripcion: string,
    fecha_limite: string,
    categoria: string,
    prioridad: string,
    dificultad: number,
  ) {
    const tarea = this.tareaRepo.create({
      titulo,
      descripcion,
      fecha_limite,
      categoria,
      prioridad,
      dificultad,
      usuario: { id: usuarioId },
    });
    const guardada = await this.tareaRepo.save(tarea);
    return this.conVencida(guardada);
  }

  async editar(
    id: number,
    titulo: string,
    descripcion: string,
    fecha_limite: string,
    categoria: string,
    prioridad: string,
    dificultad: number,
  ) {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');

    tarea.titulo       = titulo;
    tarea.descripcion  = descripcion;
    tarea.fecha_limite = fecha_limite;
    tarea.categoria    = categoria;
    tarea.prioridad    = prioridad;
    tarea.dificultad   = dificultad;

    const guardada = await this.tareaRepo.save(tarea);
    return this.conVencida(guardada);
  }

  async completar(id: number) {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    tarea.completada = true;
    const guardada = await this.tareaRepo.save(tarea);
    return this.conVencida(guardada);
  }

  async eliminar(id: number) {
    const resultado = await this.tareaRepo.delete(id);
    if (resultado.affected === 0) throw new NotFoundException('Tarea no encontrada');
    return { mensaje: 'Tarea eliminada' };
  }
}