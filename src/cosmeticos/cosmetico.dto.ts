import { IsInt, IsPositive } from 'class-validator'

export class ComprarCosmeticoDto {
  @IsInt()
  @IsPositive()
  usuarioId!: number;

  @IsInt()
  @IsPositive()
  cosmeticoId!: number;
}

export class ActivarCosmeticoDto {
  @IsInt()
  @IsPositive()
  usuarioId!: number;

  @IsInt()
  @IsPositive()
  cosmeticoId!: number;
}

export interface CosmeticoConEstadoDto {
  id:          number;
  nombre:      string;
  descripcion: string;
  tipo:        'TEMA' | 'MARCO';
  precio:      number;
  indiceLocal: number;
  comprado:    boolean;
  activo:      boolean;
}