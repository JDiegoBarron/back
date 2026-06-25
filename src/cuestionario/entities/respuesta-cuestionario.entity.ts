import { Usuario } from 'src/auth/usuario.entity';
import { Seccion } from 'src/secciones/seccion.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('respuestas_cuestionario')
export class RespuestaCuestionario {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @ManyToOne(() => Seccion)
  seccion!: Seccion;

  @Column()
  numeroPreguntaGlobal!: number;

  @Column()
  valor!: number;

  @CreateDateColumn()
  fecha!: Date;
}