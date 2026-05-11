import { PartialType } from '@nestjs/mapped-types';
import { CreateCuestionarioDto } from './create-cuestionario.dto';

export class UpdateCuestionarioDto extends PartialType(CreateCuestionarioDto) {}
