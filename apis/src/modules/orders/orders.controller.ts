import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UsersService } from '../users/users.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @Get('dashboard')
  async dashboard(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ordersService.dashboard(dbUser.id);
  }

  @Get('purchases')
  async purchases(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ordersService.myPurchases(dbUser.id);
  }

  @Get('sales')
  async sales(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ordersService.mySales(dbUser.id);
  }

  @Post()
  async create(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: CreateOrderDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ordersService.create(dbUser.id, dto);
  }

  @Patch('sales/:id/status')
  async updateSaleStatus(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ordersService.updateSaleStatus(dbUser.id, id, dto.status);
  }
}
