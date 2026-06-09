import { Module } from '@nestjs/common';
import { CosmeticosService } from './cosmeticos.service';
import { CosmeticosController } from './cosmeticos.controller';

@Module({
  controllers: [CosmeticosController],
  providers: [CosmeticosService],
})
export class CosmeticosModule {}
