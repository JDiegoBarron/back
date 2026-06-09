import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosmeticosController } from './cosmeticos.controller';
import { CosmeticosService } from './cosmeticos.service';
import { Cosmetico } from 'src/perfil/cosmetico.entity';
import { UsuarioCosmetico } from 'src/perfil/usuario-cosmetico.entity';
import { Usuario } from 'src/auth/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cosmetico,
      UsuarioCosmetico,
      Usuario,
    ]),
  ],
  controllers: [CosmeticosController],
  providers:   [CosmeticosService],
  exports:     [CosmeticosService],
})
export class CosmeticosModule {}