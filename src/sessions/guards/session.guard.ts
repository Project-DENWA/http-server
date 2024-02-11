import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SessionsService } from '../sessions.service';

interface BodyRequest {
  body: {
    refreshToken: string;
  };
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: BodyRequest = context.switchToHttp().getRequest();
    const token = request.body.refreshToken;

    const sessionExists =
      await this.sessionService.findSessionByRefreshToken(token);

    if (!sessionExists) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    await this.sessionService.updateLastActivity(sessionExists.id);
    return true;
  }
}
