// cuestionario/respuesta-cuestionario.entity.ts
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
  numeroPreguntaGlobal!: number; // 1..21, igual al índice que ya usa Swing (idx+1)

  @Column()
  valor!: number;

  @CreateDateColumn()
  fecha!: Date;
}