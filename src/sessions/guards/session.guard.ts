import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionsService } from '../sessions.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken: string | undefined = request.cookies['x-refresh-token'];

    if (!refreshToken) throw new BadRequestException('No refresh token.');

    const sessionExists = await this.sessionService.getSession({
      refreshToken,
    });
    if (!sessionExists) throw new NotFoundException('Session not found.');

    await this.sessionService.updateLastActivity(sessionExists.id);
    return true;
  }
}
