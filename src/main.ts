import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ApiKeyService } from './api-key/api-key.service';
import { ApiKeyGuard } from './api-key/guards/api-key.guard';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiKeyService = app.get(ApiKeyService);

  app.setGlobalPrefix('api/v1');

  // Crear una API Key inicial si no existe
  // const existingKeys = await apiKeyService.findAll();
  // if (existingKeys.length === 0) {
  //   const newApiKey = await apiKeyService.generate();
  //   console.log('API Key creada:', newApiKey.key);
  // }

  // const username = 'solsport-admin';
  // const password = process.env.PASSWORD_ADMIN;
  // if (!password) {
  //   throw new Error(
  //     'PASSWORD_ADMIN no está definida en las variables de entorno',
  //   );
  // }

  // await userService.create({
  //   username,
  //   password,
  // });

  // Configuración de CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173', // Cambia esto con el origen de tu aplicación React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalGuards(new ApiKeyGuard(apiKeyService));

  await app.listen(3000);
}
bootstrap();
