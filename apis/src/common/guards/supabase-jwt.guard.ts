import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
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
  private jwks?: ReturnType<typeof createRemoteJWKSet>;

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

    const secret = this.configService.get<string>('auth.jwtSecret') || '';
    const jwksUrl = this.configService.get<string>('auth.jwksUrl') || '';
    const issuer = this.configService.getOrThrow<string>('auth.jwtIssuer');
    const audience =
      this.configService.get<string>('auth.jwtAudience') || 'authenticated';
    const roleClaim = this.configService.get<string>('auth.roleClaim') || 'role';
    const requiredRole =
      this.configService.get<string>('auth.requiredRole') || 'authenticated';

    try {
      let payload: JWTPayload;

      if (secret) {
        const key = new TextEncoder().encode(secret);
        ({ payload } = await jwtVerify(token, key, {
          algorithms: ['HS256'],
          issuer,
          audience,
        }));
      } else if (jwksUrl) {
        this.jwks ??= createRemoteJWKSet(new URL(jwksUrl));
        ({ payload } = await jwtVerify(token, this.jwks, {
          issuer,
          audience,
        }));
      } else {
        throw new UnauthorizedException(
          'Server misconfigured: set AUTH_JWT_SECRET or AUTH_JWKS_URL',
        );
      }

      if (typeof payload.sub !== 'string' || !payload.sub) {
        throw new UnauthorizedException('Invalid token subject');
      }
      if (requiredRole && payload[roleClaim] !== requiredRole) {
        throw new UnauthorizedException('Invalid token role');
      }

      (request as Request & { user: SupabaseJwtPayload }).user =
        payload as SupabaseJwtPayload;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
