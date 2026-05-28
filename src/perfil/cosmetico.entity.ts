import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioCosmetico } from "./usuario-cosmetico.entity";

export enum TipoCosmetico {
    TEMA = 'TEMA',
    MARCO = 'MARCO',
}

@Entity()
export class Cosmetico {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ nullable: true })
    descripcion!: string;

    @Column({ type: 'enum', enum: TipoCosmetico })
    tipo!: TipoCosmetico

    @Column({ default: 0 })
    precio!: number;

    @Column({ name: 'indice_local', default: 0 })
    indiceLocal!: number;

    @OneToMany(() => UsuarioCosmetico, uc => uc.cosmetico)
    usuarios!: UsuarioCosmetico[];
}