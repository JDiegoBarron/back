import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // permite peticiones desde el cliente Java Swing
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);
}
bootstrap();