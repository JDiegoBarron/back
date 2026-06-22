import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/usuario.entity';
import { Cosmetico, TipoCosmetico } from 'src/perfil/cosmetico.entity';
import { UsuarioCosmetico } from 'src/perfil/usuario-cosmetico.entity';
import { DataSource, Repository } from 'typeorm';
import { ActivarCosmeticoDto, ComprarCosmeticoDto, CosmeticoConEstadoDto } from './cosmetico.dto';

@Injectable()
export class CosmeticosService {
  constructor(
    @InjectRepository(Cosmetico)
    private readonly cosmeticoRepo: Repository<Cosmetico>,

    @InjectRepository(UsuarioCosmetico)
    private readonly ucRepo: Repository<UsuarioCosmetico>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    private readonly dataSource: DataSource,
  ) { }

  async obtenerParaUsuario(userId: number): Promise<CosmeticoConEstadoDto[]> {
    // Todos los cosméticos del catálogo
    const todos = await this.cosmeticoRepo.find({ order: { tipo: 'ASC', precio: 'ASC' } });

    // Registros de este usuario
    const registros = await this.ucRepo.find({
      where: { usuarioId: userId },
      relations: ['cosmetico'],
    });

    const mapa = new Map(
      registros.map((uc) => [uc.cosmetico.id, { comprado: uc.comprado, activo: uc.activo }]),
    );

    return todos.map((c) => {
      const estado = mapa.get(c.id);
      return {
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion ?? '',
        tipo: c.tipo as 'TEMA' | 'MARCO',
        precio: c.precio,
        indiceLocal: c.indiceLocal,
        // Si no hay registro: los gratuitos se consideran comprados automáticamente
        comprado: estado ? estado.comprado : c.precio === 0,
        activo: estado ? estado.activo : false,
      };
    });
  }


  async comprar(dto: ComprarCosmeticoDto): Promise<{ monedasRestantes: number }> {
    const { usuarioId, cosmeticoId } = dto;

    const cosmetico = await this.cosmeticoRepo.findOne({ where: { id: cosmeticoId } });
    if (!cosmetico) throw new NotFoundException('Cosmético no encontrado');

    // Verificar que no esté ya comprado
    const existente = await this.ucRepo.findOne({
      where: { usuarioId, cosmetico: { id: cosmeticoId } },
      relations: ['cosmetico'],
    });
    if (existente?.comprado) {
      throw new BadRequestException('Este cosmético ya fue comprado');
    }

    const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (usuario.monedas < cosmetico.precio) {
      throw new HttpException('Monedas insuficientes', HttpStatus.PAYMENT_REQUIRED);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Descontar monedas
      usuario.monedas -= cosmetico.precio;
      await queryRunner.manager.save(usuario);

      if (existente) {
        existente.comprado = true;
        await queryRunner.manager.save(existente);
      } else {
        const nuevo = queryRunner.manager.create(UsuarioCosmetico, {
          usuarioId,
          cosmetico,
          comprado: true,
          activo: false,
        });
        await queryRunner.manager.save(nuevo);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    // Devolver saldo actualizado
    return { monedasRestantes: usuario.monedas };
  }

  async activar(dto: ActivarCosmeticoDto): Promise<{ ok: boolean }> {
    const { usuarioId, cosmeticoId } = dto;

    const cosmetico = await this.cosmeticoRepo.findOne({ where: { id: cosmeticoId } });
    if (!cosmetico) throw new NotFoundException('Cosmético no encontrado');

    const registro = await this.ucRepo.findOne({
      where: { usuarioId, cosmetico: { id: cosmeticoId } },
      relations: ['cosmetico'],
    });

    const esAccesible = (registro?.comprado) || cosmetico.precio === 0;
    if (!esAccesible) {
      throw new BadRequestException('Debes comprar este cosmético antes de activarlo');
    }

    const cosmeticosMismoTipo = await this.cosmeticoRepo.find({
      where: { tipo: cosmetico.tipo },
      select: ['id'],
    });
    const ids = cosmeticosMismoTipo.map((c) => c.id);

    if (ids.length > 0) {
      await this.ucRepo
        .createQueryBuilder()
        .update()
        .set({ activo: false })
        .where('usuario_id = :uid AND activo = true AND cosmetico_id IN (:...ids)', {
          uid: usuarioId,
          ids,
        })
        .execute();
    }

    if (registro) {
      registro.activo = true;
      registro.comprado = true; // garantizar comprado para gratuitos
      await this.ucRepo.save(registro);
    } else {
      // Primera vez que activa un cosmético gratuito: crear el registro
      const nuevo = this.ucRepo.create({
        usuarioId,
        cosmetico,
        comprado: true,
        activo: true,
      });
      await this.ucRepo.save(nuevo);
    }

    return { ok: true };
  }

  async inicializarParaNuevoUsuario(usuarioId: number): Promise<void> {
    const gratuitos = await this.cosmeticoRepo.find({ where: { precio: 0 } });

    for (const c of gratuitos) {
      // Es el tema predeterminado (índice 0) → activarlo
      const esDefault = c.tipo === TipoCosmetico.TEMA && c.indiceLocal === 0;

      const uc = this.ucRepo.create({
        usuarioId,
        cosmetico: c,
        comprado: true,
        activo: esDefault,
      });
      await this.ucRepo.save(uc);
    }
  }
}