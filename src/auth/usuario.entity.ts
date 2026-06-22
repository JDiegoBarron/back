import { Perfil } from 'src/perfil/perfil.entity';
import { UsuarioCosmetico } from 'src/perfil/usuario-cosmetico.entity';
import { Tarea } from 'src/tareas/tarea.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string; 

  @Column()
  nombre_completo!: string;

  @Column({ default: true })
  activo!: boolean;

  @Column({ default: 0 })
  monedas!: number;

  @Column({ name: 'racha_actual', default: 0 })
  rachaActual!: number;

  @Column({ name: 'mejor_racha', default: 0 })
  mejorRacha!: number;

  @Column({ name: 'ultimo_login', type: 'date', nullable: true })
  ultimoLogin!: string | null;

  @OneToOne(() => Perfil, perfil => perfil.usuario, { cascade: true })
  perfil!: Perfil;

  @OneToMany(() => Tarea, tarea => tarea.usuario)
  tareas!: Tarea[];

  @OneToMany(() => UsuarioCosmetico, uc => uc.usuario)
  cosmeticosComprados!: UsuarioCosmetico[];
}