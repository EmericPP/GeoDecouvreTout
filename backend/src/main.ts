import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe());
  
  // Autoriser les requêtes CORS (pour le frontend Expo)
  app.enableCors({
    origin: '*', // À restreindre en production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}

bootstrap();
