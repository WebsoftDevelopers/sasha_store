import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Request } from 'express';

export type SupabaseJwtPayload = {
  sub: string;
  email?: string;
  role?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
};

@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const secret = this.configService.get<string>('supabase.jwtSecret') || '';
    const jwksUrl = this.configService.get<string>('supabase.jwksUrl') || '';
    const supabaseUrl = this.configService.getOrThrow<string>('supabase.url');
    const issuer = `${supabaseUrl.replace(/\/$/, '')}/auth/v1`;

    try {
      let payload;

      if (secret) {
        const key = new TextEncoder().encode(secret);
        try {
          ({ payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
            issuer,
            audience: 'authenticated',
          }));
        } catch {
          ({ payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
            audience: 'authenticated',
          }));
        }
      } else if (jwksUrl) {
        const JWKS = createRemoteJWKSet(new URL(jwksUrl));
        try {
          ({ payload } = await jwtVerify(token, JWKS, {
            issuer,
            audience: 'authenticated',
          }));
        } catch {
          ({ payload } = await jwtVerify(token, JWKS, {
            audience: 'authenticated',
          }));
        }
      } else {
        throw new UnauthorizedException(
          'Server misconfigured: set SUPABASE_JWT_SECRET or SUPABASE_JWKS_URL',
        );
      }

      (request as Request & { user: SupabaseJwtPayload }).user = payload;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
