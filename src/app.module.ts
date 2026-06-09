import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TareasModule } from './tareas/tareas.module';
import { PerfilModule } from './perfil/perfil.module';
import { CuestionarioModule } from './cuestionario/cuestionario.module';
import { RachaModule } from './racha/racha.module';
import { CosmeticosModule } from './cosmeticos/cosmeticos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '3306')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // crea las tablas automáticamente (perfecto para proyecto escolar)
      }),
    }),
    AuthModule,
    TareasModule,
    PerfilModule,
    CuestionarioModule,
    RachaModule,
    CosmeticosModule,
  ],
})
export class AppModule {}