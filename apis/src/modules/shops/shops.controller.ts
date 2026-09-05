import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UsersService } from '../users/users.service';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(
    private readonly shopsService: ShopsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.shopsService.getBySlug(slug);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async getMine(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.getMine(dbUser.id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async create(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: CreateShopDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.create(dbUser.id, dto);
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async updateMine(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: UpdateShopDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.updateMine(dbUser.id, dto);
  }

  @Post('me/submit-verification')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async submitVerification(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.submitVerification(dbUser.id);
  }

  @Get('admin/pending')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async pending(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.listPending(dbUser.role === 'ADMIN');
  }

  @Post('admin/:id/verify')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async verify(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id') id: string,
    @Query('approve') approve = 'true',
    @Body() body?: { note?: string },
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.verifyShop(
      dbUser.role === 'ADMIN',
      id,
      approve !== 'false',
      body?.note,
    );
  }
}
