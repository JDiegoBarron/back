import { Controller } from '@nestjs/common';
import { RachaService } from './racha.service';

@Controller('racha')
export class RachaController {
  constructor(private readonly rachaService: RachaService) {}
}
