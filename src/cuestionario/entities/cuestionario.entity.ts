import { Usuario } from 'src/auth/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';


@Entity('cuestionarios')
export class Cuestionario {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  // académica
  @Column() p1!: number;
  @Column() p2!: number;
  @Column() p3!: number;
  @Column() p4!: number;
  @Column() p5!: number;

  // sueño y descanso
  @Column() p6!: number;
  @Column() p7!: number;
  @Column() p8!: number;
  @Column() p9!: number;

  // personal emocional
  @Column() p10!: number;
  @Column() p11!: number;
  @Column() p12!: number;
  @Column() p13!: number;

  // social
  @Column() p14!: number;
  @Column() p15!: number;
  @Column() p16!: number;

  // equilibrio
  @Column() p17!: number;
  @Column() p18!: number;
  @Column() p19!: number;

  // fisica
  @Column() p20!: number;
  @Column() p21!: number;

  @CreateDateColumn()
  fecha!: Date;
}