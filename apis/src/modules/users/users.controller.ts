import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: SupabaseJwtPayload) {
    return this.usersService.ensureFromJwt(user);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: SupabaseJwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    await this.usersService.ensureFromJwt(user);
    return this.usersService.updateProfile(user.sub, dto);
  }
}
