import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../auth/usuario.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  correo!: string;

  @Column({ nullable: true })
  carrera!: string;

  @Column({ nullable: true })
  semestre!: number;

  @OneToOne(() => Usuario, usuario => usuario.perfil)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;
}