import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SessionRo } from './ro/session.ro';
import ResponseRo from 'src/common/ro/Response.ro';
import { CloseSessionDto } from './dto/close-session.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private sessionService: SessionsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all active sessions' })
  @ApiOkResponse({ type: [SessionRo] })
  @Get('/getAll')
  async getAllSessions(@Req() req: AuthenticatedRequest): Promise<SessionRo[]> {
    const sessions = await this.sessionService.getAllSessions({
      userId: req.user.id,
    });
    return sessions.map((session) => new SessionRo(session));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Close session' })
  @ApiOkResponse({ type: ResponseRo })
  @Post('/close-session')
  async closeSession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CloseSessionDto,
  ): Promise<ResponseRo> {
    await this.sessionService.deleteSession(dto.id, req.user.id);

    return {
      ok: true,
      message: 'The session has been closed.',
    };
  }
}
