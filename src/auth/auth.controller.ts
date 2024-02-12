import { Body, Controller, Get, Ip, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SessionGuard } from 'src/sessions/guards/session.guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
      private userService: UsersService,
      private authService: AuthService,
      private sessionService: SessionsService,
    ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    description: 'Successful account registration',
    status: 201,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            tokens: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                },
                refreshToken: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                },
              },
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 21,
                },
                fio: {
                  type: 'string',
                  example: 'Ivanov Ivan Ivanovich',
                },
                email: {
                  type: 'string',
                  example: 'example@gmail.com',
                },
                username: {
                  type: 'string',
                  example: 'ExampleName',
                },
                isEmailVerified: {
                  type: 'boolean',
                  example: false,
                },
                bio: {
                  type: 'string',
                  example: null,
                },
                avatarUrl: {
                  type: 'string',
                  example: null,
                },
                coverImageUrl: {
                  type: 'string',
                  example: null,
                },
                websiteURL: {
                  type: 'string',
                  example: null,
                },
                twitter: {
                  type: 'string',
                  example: null,
                },
                reddit: {
                  type: 'string',
                  example: null,
                },
                notifyGifts: {
                  type: 'boolean',
                  example: true,
                },
                notifySales: {
                  type: 'boolean',
                  example: true,
                },
                notifyExpiredListingsOffers: {
                  type: 'boolean',
                  example: true,
                },
                notifyRecommendations: {
                  type: 'boolean',
                  example: true,
                },
                notifyNews: {
                  type: 'boolean',
                  example: true,
                },
                createdAt: {
                  type: 'string',
                  example: '2022-12-11T16:08:02.949Z',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Message that a user with this mail/username already exists',
    status: 409,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Such a user already exists' },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Message that this mail does not exist',
    status: 400,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'The email address provided cannot receive messages.',
            },
          },
        },
      },
    },
  })
  @Post('/registration')
  registration(
    @Body() dto: CreateUserDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.authService.registration(dto, req, ip);
  }

  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({
    description: 'Successful account log in',
    status: 201,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            tokens: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                },
                refreshToken: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                },
              },
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 21,
                },
                fio: {
                  type: 'string',
                  example: 'Ivanov Ivan Ivanovich',
                },
                email: {
                  type: 'string',
                  example: 'example@gmail.com',
                },
                username: {
                  type: 'string',
                  example: 'ExampleName',
                },
                isEmailVerified: {
                  type: 'boolean',
                  example: false,
                },
                bio: {
                  type: 'string',
                  example: null,
                },
                avatarUrl: {
                  type: 'string',
                  example: null,
                },
                coverImageUrl: {
                  type: 'string',
                  example: null,
                },
                websiteURL: {
                  type: 'string',
                  example: null,
                },
                twitter: {
                  type: 'string',
                  example: null,
                },
                reddit: {
                  type: 'string',
                  example: null,
                },
                notifyGifts: {
                  type: 'boolean',
                  example: true,
                },
                notifySales: {
                  type: 'boolean',
                  example: true,
                },
                notifyExpiredListingsOffers: {
                  type: 'boolean',
                  example: true,
                },
                notifyRecommendations: {
                  type: 'boolean',
                  example: true,
                },
                notifyNews: {
                  type: 'boolean',
                  example: true,
                },
                createdAt: {
                  type: 'string',
                  example: '2022-12-11T16:08:02.949Z',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Message that this user does not exist',
    status: 404,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'User not found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Message that the password is incorrect',
    status: 401,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'The passwords do not match',
            },
          },
        },
      },
    },
  })
  @Post('/login')
  login(@Body() dto: LoginUserDto, @Req() req: Request, @Ip() ip: string) {
    return this.authService.login(dto, req, ip);
  }

  @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Updating the access token',
  })
  @ApiResponse({
    description: 'New access token generated',
    status: 201,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Token invalidity message',
    status: 401,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Invalid refresh token',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Message that session not found',
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
  @Post('refreshToken')
  async refresh(@Body() dto: RefreshTokenDto) {
    const accessToken = await this.authService.refreshAccessToken(
      dto.refreshToken,
    );
    return { accessToken };
  }

  @ApiOperation({
    summary: 'Activation of user account after clicking on the link',
  })
  @ApiResponse({
    description: 'Successful mail confirmation',
    status: 200,
  })
  @ApiResponse({
    description: 'Message that session is invalid',
    status: 404,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Activation token is invalid' },
          },
        },
      },
    },
  })
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    return await this.userService.activateAccount(token);
  }
}
