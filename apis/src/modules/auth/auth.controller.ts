import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SupabaseJwtGuard } from '../../common/guards/supabase-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';

@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(SupabaseJwtGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: SupabaseJwtPayload) {
    return this.usersService.ensureFromJwt(user);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out. Clear the session on the client.' };
  }
}
