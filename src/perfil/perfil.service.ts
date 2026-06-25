import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perfil } from './perfil.entity';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepo: Repository<Perfil>,
  ) {}

  async obtener(usuarioId: number) {
    const perfil = await this.perfilRepo.findOne({
      where: { usuario: { id: usuarioId } },
    });
    if (!perfil) throw new NotFoundException('Perfil no encontrado');
    return perfil;
  }

  async guardar(usuarioId: number, correo: string, carrera: string, semestre: number) {
    let perfil = await this.perfilRepo.findOne({
      where: { usuario: { id: usuarioId } },
    });

    if (perfil) {
      perfil.correo = correo;
      perfil.carrera = carrera;
      perfil.semestre = semestre;
    } else {
      perfil = this.perfilRepo.create({
        correo, carrera, semestre,
        usuario: { id: usuarioId },
      });
    }
    return await this.perfilRepo.save(perfil);
  }
}