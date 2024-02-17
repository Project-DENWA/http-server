import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicUserDto } from './dto/public-user.dto';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { UserModel } from 'src/models/user.model';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { UpdateUsernameDto } from './dto/update-username.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @ApiOperation({ summary: 'Get user profile by username' })
    @ApiResponse({ status: 200, type: PublicUserDto })
    @ApiResponse({
      description: 'Message that user not found',
      status: 404,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'User not found' },
            },
          },
        },
      },
    })
    @Get('/profile/:username')
    async getProfileByUsername(@Param('username') username: string) {
      const user = await this.userService.getUser({ name: username });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new PublicUserDto(user);
    }

    @ApiOperation({ summary: 'Get user profile by IdUser' })
    @ApiResponse({ status: 200, type: PublicUserDto })
    @ApiResponse({
        description: 'Message that user not found',
        status: 404,
        content: {
        'application/json': {
            schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User not found' },
            },
            },
        },
        },
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'JWT access token in the format "Bearer <token>"',
        required: true,
    })
    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfileById(@Req() req: AuthenticatedRequest) {
        const userModel = await this.userService.getUser({ id: req.user.id });
    if (!userModel) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } 
        return new PublicUserDto(userModel);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [UserModel] })
    @Get('/')
    getAll() {
        return this.userService.getAll();
    }

    @ApiHeader({
        name: 'Authorization',
        description: 'JWT access token in the format "Bearer <token>"',
        required: true,
      })
      @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
      @Get('/test')
      test() {
        return {
          message: 'cool',
        };
      }

      @ApiOperation({ summary: 'Username update' })
      @Patch('update-username')
      @ApiHeader({
        name: 'Authorization',
        description: 'JWT access token in the format "Bearer <token>"',
        required: true,
      })
      @ApiResponse({ status: 200, description: 'Successful mail update' })
      @ApiResponse({
        description: 'Message that user not found',
        status: 404,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'User not found' },
              },
            },
          },
        },
      })
      @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
      updateUsername(
        @Req() req: AuthenticatedRequest,
        @Body() updateUsernameDto: UpdateUsernameDto,
      ) {
        return this.userService.updateUsername(req.user.id, updateUsernameDto);
      }

      
}
