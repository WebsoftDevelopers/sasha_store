import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SupabaseJwtPayload } from '../guards/supabase-jwt.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SupabaseJwtPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: SupabaseJwtPayload }>();
    return request.user;
  },
);
