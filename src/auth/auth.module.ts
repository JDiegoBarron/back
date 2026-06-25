import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from './usuario.entity';
import { CosmeticosModule } from 'src/cosmeticos/cosmeticos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    CosmeticosModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule], 
})
export class AuthModule {}