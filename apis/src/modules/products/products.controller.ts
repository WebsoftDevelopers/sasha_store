import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UsersService } from '../users/users.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(@Query() query: ListProductsQueryDto) {
    return this.productsService.findAllPublic(query);
  }

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async findMine(@CurrentUser() user: SupabaseJwtPayload) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.productsService.findMine(dbUser.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOnePublic(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async create(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: CreateProductDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.productsService.create(dbUser.id, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: UpdateProductDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.productsService.update(id, dbUser.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(SupabaseJwtGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: SupabaseJwtPayload,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.productsService.remove(id, dbUser.id);
  }
}
