import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SessionsService } from './sessions/sessions.service';
import { TokensService } from './tokens/tokens.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly tokensService: TokensService,
  ) {}

  @Cron('0 0 * * *')
  handleDailyCron(): void {
    this.sessionsService.deleteOldSessions();
  }

  @Cron('0 * * * *')
  handleHourlyCron(): void {
    this.tokensService.deleteOldTokens();
  }
}
