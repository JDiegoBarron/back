import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seccion } from 'src/secciones/seccion.entity';
import { RespuestaCuestionario } from './entities/respuesta-cuestionario.entity';
import { UltimaRespuestaSeccion } from './entities/ultima-respuesta-seccion.entity';

interface RespuestaDto { pregunta: number; valor: number; }

const RANGO_SECCION: Record<string, [number, number]> = {
  academica:  [1, 5],
  sueno:      [6, 9],
  emocional:  [10, 13],
  social:     [14, 16],
  equilibrio: [17, 19],
  fisica:     [20, 21],
};

@Injectable()
export class CuestionarioService {
  constructor(
    @InjectRepository(Seccion)
    private seccionRepo: Repository<Seccion>,
    @InjectRepository(RespuestaCuestionario)
    private respuestaRepo: Repository<RespuestaCuestionario>,
    @InjectRepository(UltimaRespuestaSeccion)
    private ultimaRepo: Repository<UltimaRespuestaSeccion>,
  ) {}

  private calcularDisponibilidad(seccion: Seccion, ultimaFecha?: Date): boolean {
    if (!ultimaFecha) return true;
    const dias = seccion.tipoPeriodicidad === 'DIARIA' ? 1 : seccion.intervaloDias!;
    const limite = new Date(ultimaFecha);
    limite.setDate(limite.getDate() + dias);
    return new Date() >= limite;
  }

  private calcularProximaFecha(seccion: Seccion, ultimaFecha: Date): Date {
    const dias = seccion.tipoPeriodicidad === 'DIARIA' ? 1 : seccion.intervaloDias!;
    const limite = new Date(ultimaFecha);
    limite.setDate(limite.getDate() + dias);
    return limite;
  }

  /**
   * Estado completo para renderizar el cuestionario:
   * por cada sección, si está disponible, cuándo vuelve a estarlo,
   * y los últimos valores de sus preguntas (para precargar sliders bloqueados).
   */
  async obtenerEstadoCompleto(usuarioId: number) {
    const secciones = await this.seccionRepo.find({ order: { orden: 'ASC' } });
    const ultimas = await this.ultimaRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['seccion'],
    });

    const resultado: {
      clave: string;
      nombre: string;
      disponible: boolean;
      proximaDisponible: Date | null;
      ultimosValores: Record<number, number>;
    }[] = [];
    for (const seccion of secciones) {
      const ultima = ultimas.find(u => u.seccion.id === seccion.id);
      const disponible = this.calcularDisponibilidad(seccion, ultima?.contestadaEn);

      const [desde, hasta] = RANGO_SECCION[seccion.clave];
      const ultimosValores = await this.obtenerUltimosValoresPreguntas(usuarioId, desde, hasta);

      resultado.push({
        clave: seccion.clave,
        nombre: seccion.nombre,
        disponible,
        proximaDisponible: disponible || !ultima
          ? null
          : this.calcularProximaFecha(seccion, ultima.contestadaEn),
        ultimosValores, 
      });
    }
    return resultado;
  }

  private async obtenerUltimosValoresPreguntas(usuarioId: number, desde: number, hasta: number) {
    const valores: Record<number, number> = {};
    for (let p = desde; p <= hasta; p++) {
      const ultima = await this.respuestaRepo.findOne({
        where: { usuario: { id: usuarioId }, numeroPreguntaGlobal: p },
        order: { fecha: 'DESC' },
      });
      if (ultima) valores[p] = ultima.valor;
    }
    return valores;
  }

  /**
   * Guarda solo las secciones que el usuario tenía habilitadas.
   * `respuestasPorSeccion` = { [seccionClave]: RespuestaDto[] }
   */
  async guardar(usuarioId: number, respuestasPorSeccion: Record<string, RespuestaDto[]>) {
    const secciones = await this.seccionRepo.find();
    const ahora = new Date();

    for (const [clave, respuestas] of Object.entries(respuestasPorSeccion)) {
      const seccion = secciones.find(s => s.clave === clave);
      if (!seccion) continue;

      const filas = respuestas.map(r => this.respuestaRepo.create({
        usuario: { id: usuarioId } as any,
        seccion,
        numeroPreguntaGlobal: r.pregunta,
        valor: r.valor,
      }));
      await this.respuestaRepo.save(filas);

      await this.ultimaRepo.upsert(
        { usuario: { id: usuarioId } as any, seccion, contestadaEn: ahora },
        ['usuario', 'seccion'],
      );
    }
    return { ok: true };
  }

  
async obtenerUltimasRespuestasCompletas(usuarioId: number): Promise<number[] | null> {
  const valores: (number | null)[] = new Array(21).fill(null);

  for (let p = 1; p <= 21; p++) {
    const ultima = await this.respuestaRepo.findOne({
      where: { usuario: { id: usuarioId }, numeroPreguntaGlobal: p },
      order: { fecha: 'DESC' },
    });
    if (ultima) valores[p - 1] = ultima.valor;
  }
  if (valores.every(v => v === null)) return null;

  return valores.map(v => v ?? 3);
}
}