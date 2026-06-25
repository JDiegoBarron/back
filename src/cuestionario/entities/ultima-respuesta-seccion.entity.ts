import { Usuario } from 'src/auth/usuario.entity';
import { Seccion } from 'src/secciones/seccion.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('ultima_respuesta_seccion')
export class UltimaRespuestaSeccion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @ManyToOne(() => Seccion)
  seccion!: Seccion;

  @Column({ type: 'timestamp' })
  contestadaEn!: Date;
}