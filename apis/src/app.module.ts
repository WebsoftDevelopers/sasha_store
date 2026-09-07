import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { ShopsModule } from './modules/shops/shops.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { StorageModule } from './modules/storage/storage.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ShopsModule,
    ProductsModule,
    RatingsModule,
    OrdersModule,
    StorageModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
