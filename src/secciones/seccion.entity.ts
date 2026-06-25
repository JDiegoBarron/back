// secciones/seccion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('secciones')
export class Seccion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  clave!: string; // 'academica' | 'sueno' | 'emocional' | 'social' | 'equilibrio' | 'fisica'

  @Column()
  nombre!: string;

  @Column()
  orden!: number; // 0..5, para mantener el orden de renderizado

  @Column({ type: 'enum', enum: ['DIARIA', 'PERIODICA'] })
  tipoPeriodicidad!: 'DIARIA' | 'PERIODICA';

  @Column({ nullable: true })
  intervaloDias!: number | null; // 5 para las periódicas, null para diarias
}