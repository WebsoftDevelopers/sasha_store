import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProvider, User } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { SupabaseJwtPayload } from '../../common/guards/supabase-jwt.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureFromJwt(payload: SupabaseJwtPayload): Promise<User> {
    const email = payload.email;
    if (!email) {
      throw new UnauthorizedException('JWT is missing email claim');
    }

    const provider =
      payload.app_metadata?.provider === 'google'
        ? AuthProvider.google
        : AuthProvider.email;

    const fullName =
      payload.user_metadata?.full_name ||
      payload.user_metadata?.name ||
      email.split('@')[0];

    const avatarUrl =
      payload.user_metadata?.avatar_url || payload.user_metadata?.picture;

    return this.prisma.user.upsert({
      where: { id: payload.sub },
      create: {
        id: payload.sub,
        email,
        fullName,
        avatarUrl,
        authProvider: provider,
      },
      update: {
        email,
        fullName: fullName ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        authProvider: provider,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
      },
    });
  }
}
