import { Body, Controller, Get, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { SessionModel } from 'src/models/sessions.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';
import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private sessionService: SessionsService) {}

  @ApiOperation({ summary: 'Get all active sessions' })
  @ApiResponse({ type: [SessionModel], status: 200 })
  @Get('/')
  async getAllActiveSessions() {
    return this.sessionService.getAllActiveSessions();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get active sessions by userId from JWT' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT access token in the format "Bearer <token>"',
    required: true,
  })
  @ApiResponse({
    description: 'All active user sessions',
    type: [SessionModel],
    status: 200,
  })
  @ApiResponse({
    description: 'User ID not found',
    status: 404,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User ID not found' },
          },
        },
      },
    },
  })
  @Get('/byUserId')
  async getSessionByJwt(@Req() req: AuthenticatedRequest) {
    return this.sessionService.findSessionsByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Close session by jwt' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT access token in the format "Bearer <token>"',
    required: true,
  })
  @ApiResponse({
    description: 'Successful session deletion message',
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Session has been deleted' },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Session not found',
    status: 404,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Session not found' },
          },
        },
      },
    },
  })
  @Delete('/')
  async closeSession(@Body() dto: RefreshTokenDto) {
    return this.sessionService.closeSessionByJWT(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find session by RefreshToken' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT access token in the format "Bearer <token>"',
    required: true,
  })
  @ApiResponse({
    description: 'Successful find session message',
    status: 200,
    type: CreateSessionDto,
  })
  @ApiResponse({
    description: 'Message about problem with a token',
    status: 401,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'No JWT provided' },
          },
        },
      },
    },
  })
  @Get('/findByRefresh')
  async findByRefresh(@Body() dto: RefreshTokenDto) {
    return this.sessionService.findSessionByRefreshToken(dto.refreshToken);
  }
  // @ApiOperation({summary: 'Close session by user Id'})
  // @Delete('/:userId')
  // async closeSessionByUserId(@Param('userId') userId: number) {
  //   return this.sessionService.closeSessionByUserId()
  // }
}
