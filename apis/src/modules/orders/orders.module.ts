import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [UsersModule, ShopsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
