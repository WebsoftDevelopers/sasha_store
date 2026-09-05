import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UsersService } from '../users/users.service';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('product/:productId')
  forProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.ratingsService.forProduct(productId);
  }

  @Get('mine/shop')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async forMyShop(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ratingsService.forMyShopProducts(dbUser.id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async upsert(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: CreateRatingDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.ratingsService.upsert(dbUser.id, dto);
  }
}
