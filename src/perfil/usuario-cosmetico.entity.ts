import { Usuario } from "src/auth/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cosmetico } from "./cosmetico.entity";

@Entity()
export class UsuarioCosmetico {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, u => u.cosmeticosComprados)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Cosmetico, c => c.usuarios)
  @JoinColumn({ name: 'cosmetico_id' })
  cosmetico!: Cosmetico;

  @Column({ default: false })
  comprado!: boolean;

  @Column({ default: false })
  activo!: boolean;

  @CreateDateColumn({ name: 'comprado_at' })
  compradoAt!: Date;
}