import { Controller } from '@nestjs/common';
import { CosmeticosService } from './cosmeticos.service';

@Controller('cosmeticos')
export class CosmeticosController {
  constructor(private readonly cosmeticosService: CosmeticosService) {}
}
