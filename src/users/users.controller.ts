import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { UserModel } from 'src/models/user.model';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import ResponseRo from 'src/common/ro/Response.ro';
import { promisify } from 'util';
import * as fs from 'fs';
import { multerAvatarConfig } from 'src/config/multer-avatar.config';
import { multerCoverConfig } from 'src/config/multer-cover.config';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PublicUserRo } from './ro/public-user.ro';

const unlinkAsync = promisify(fs.unlink);


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @ApiOperation({ summary: 'Get user profile by username' })
    @ApiResponse({ status: 200, type: PublicUserRo })
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
      return new PublicUserRo(user);
    }

    @ApiOperation({ summary: 'Get user profile by IdUser' })
    @ApiResponse({ status: 200, type: PublicUserRo })
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
        return new PublicUserRo(userModel);
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
      @ApiBearerAuth('access-token')
      @Patch('update-username')
      @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
      updateUsername(
        @Req() req: AuthenticatedRequest,
        @Body() updateUsernameDto: UpdateUsernameDto,
      ) {
        return this.userService.updateUsername(req.user.id, updateUsernameDto);
      }

      @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
      @ApiOperation({ summary: 'Switch 2FA' })
      @Patch('/switch2fa')
      async sendEmailTfa(@Req() req: AuthenticatedRequest) {
        return this.userService.switchTfa(req.user.id);
      }

      @ApiOperation({ summary: 'Updating the user avatar' })
      @ApiBearerAuth('access-token')
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        description: 'Avatar file',
        required: true,
        schema: {
          type: 'object',
          properties: {
            newAvatar: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
      @Patch('/avatar')
      @UseGuards(JwtAuthGuard)
      @UseInterceptors(FileInterceptor('newAvatar', multerAvatarConfig))
      async updateAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: AuthenticatedRequest,
      ): Promise<ResponseRo> {
        if (!file) {
          throw new BadRequestException('The file has not been provided');
        }
        const userModel = await this.userService.getUser({ id: req.user.id });
        if (!userModel) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const previousAvatarPath = `uploads/avatars/${userModel.avatar.icon}`;
    
        const avatarUrl: string = await this.userService.setAvatar(
          userModel.id,
          file.filename,
        );
    
        if (userModel.avatar.icon) {
          try {
            await unlinkAsync(previousAvatarPath);
          } catch (error) {
            console.error('Error deleting previous avatar:', error.message);
          }
        }
    
        return {
          ok: true,
          result: avatarUrl,
        };
      }

      @ApiOperation({ summary: 'Getting an avatar' })
      @Get('avatar/:fileId')
      async serveAvatar(
        @Param('fileId') fileId: string,
        @Res() res: any,
      ): Promise<any> {
        res.sendFile(fileId, { root: 'uploads/avatars' });
      }

      @ApiOperation({ summary: 'Updating the user cover' })
      @ApiBearerAuth('access-token')
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        description: 'Cover file',
        required: true,
        schema: {
          type: 'object',
          properties: {
            newCover: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
      @UseGuards(JwtAuthGuard)
      @Patch('/cover')
      @UseInterceptors(FileInterceptor('newCover', multerCoverConfig))
      async updateCover(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: AuthenticatedRequest,
      ): Promise<ResponseRo> {
        if (!file) {
          throw new BadRequestException('The file has not been provided');
        }
        const userModel = await this.userService.getUser({ id: req.user.id });
        if (!userModel) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        const previousCoverPath = `uploads/covers/${userModel.avatar.cover}`;
    
        const coverUrl: string = await this.userService.setCover(
          userModel.id,
          file.filename,
        );
    
        if (userModel.avatar.cover) {
          try {
            await unlinkAsync(previousCoverPath);
          } catch (error) {
            console.error('Error deleting previous avatar:', error.message);
          }
        }
    
        return {
          ok: true,
          result: coverUrl,
        };
      }
    
      @ApiOperation({ summary: 'Getting a cover' })
      @ApiResponse({
        description: 'Get cover image',
        status: 200,
        content: {
          'image/png': {},
        },
      })
      @Get('cover/:fileId')
      async serveCover(
        @Param('fileId') fileId: string,
        @Res() res: any,
      ): Promise<any> {
        res.sendFile(fileId, { root: 'uploads/covers' });
      }

      @ApiOperation({ summary: 'Profile update' })
      @ApiBearerAuth('access-token')
      @Patch('update-profile')
      @ApiResponse({ status: 200, description: 'Successful profile update' })
      @UseGuards(JwtAuthGuard)
      updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateProfileDto,
      ): Promise<ResponseRo> {
        return this.userService.updateProfile(req.user.id, dto);
      }
}
