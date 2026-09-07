import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { VendorStatus } from '../../../generated/prisma/client';

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
    return this.shopsService.resubmit(dbUser.id);
  }

  @Post('me/resubmit')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async resubmit(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: UpdateShopDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.resubmit(dbUser.id, dto);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async adminList(
    @CurrentUser() user: SupabaseJwtPayload,
    @Query('status') status?: VendorStatus,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    const validStatus = status && Object.values(VendorStatus).includes(status);
    return this.shopsService.listAdmin(
      dbUser.role === 'ADMIN',
      validStatus ? status : undefined,
    );
  }

  @Get('admin/pending')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async pending(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.listAdmin(
      dbUser.role === 'ADMIN',
      VendorStatus.PENDING,
    );
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async adminDetail(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.getAdmin(dbUser.role === 'ADMIN', id);
  }

  @Post('admin/:id/approve')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async approve(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body?: { note?: string },
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.approve(
      dbUser.role === 'ADMIN',
      dbUser.id,
      id,
      body?.note,
    );
  }

  @Post('admin/:id/reject')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async reject(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body?: { reason?: string; comment?: string; missingDocuments?: string[] },
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.reject(dbUser.role === 'ADMIN', dbUser.id, id, body);
  }

  @Post('admin/:id/suspend')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async suspend(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body?: { comment?: string },
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.setStatus(
      dbUser.role === 'ADMIN',
      dbUser.id,
      id,
      VendorStatus.SUSPENDED,
      body?.comment,
    );
  }

  @Post('admin/:id/disable')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async disable(
    @CurrentUser() user: SupabaseJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body?: { comment?: string },
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.shopsService.setStatus(
      dbUser.role === 'ADMIN',
      dbUser.id,
      id,
      VendorStatus.DISABLED,
      body?.comment,
    );
  }
}
