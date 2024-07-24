import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MulterConfigModule } from './multer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { MaterialsModule } from './materials/materials.module';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.POSTGRES_URL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Ruta al directorio de archivos estáticos
      serveRoot: '/uploads', // Ruta base para servir archivos estáticos
    }),
    MulterConfigModule,
    ProductsModule,
    CategoriesModule,
    ServicesModule,
    MaterialsModule,
    ClientsModule,
    UsersModule,
    ApiKeyModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
