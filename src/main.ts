import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ApiKeyService } from './api-key/api-key.service';
import { ApiKeyGuard } from './api-key/guards/api-key.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiKeyService = app.get(ApiKeyService);
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('api/v1');

  // Configuración de CORS
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://solsport.vercel.app',
        'http://localhost:5173',
        'https://sociedadcosmopolita.com.ar',
      ];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

  const config = new DocumentBuilder()
    .setTitle('API Solsport')
    .setDescription('API creada para la página web de Solsport.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalGuards(new ApiKeyGuard(apiKeyService));

  await app.listen(port);
}
bootstrap();
