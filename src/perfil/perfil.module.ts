import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { Perfil } from './perfil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil])],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}