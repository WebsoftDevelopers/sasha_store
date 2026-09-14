import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UsersService } from '../users/users.service';
import { StorageService } from './storage.service';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';

@ApiTags('storage')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard)
@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly usersService: UsersService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(
    @CurrentUser() user: SupabaseJwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Query('context') context?: string,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.storageService.uploadFile(dbUser.id, file, context);
  }

  @Post('assets')
  async createAsset(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: CreateMediaAssetDto,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.storageService.createAsset(dbUser.id, dto);
  }

  @Get('assets')
  async assets(
    @CurrentUser() user: SupabaseJwtPayload,
    @Query('context') context?: string,
  ) {
    const dbUser = await this.usersService.ensureFromJwt(user);
    return this.storageService.listMine(dbUser.id, context);
  }
}
