import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from '../auth/usuario.entity';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ type: 'date', nullable: true })
  fecha_limite!: string;

  /** 'Curricular' | 'Extracurricular' | 'Recreación' */
  @Column({ default: 'Curricular' })
  categoria!: string;

  /** 'Alta' | 'Media' | 'Baja' */
  @Column({ default: 'Media' })
  prioridad!: string;

  /** Escala 1-5 */
  @Column({ default: 1 })
  dificultad!: number;

  @Column({ default: false })
  completada!: boolean;

  @CreateDateColumn()
  creada_en!: Date;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;
}