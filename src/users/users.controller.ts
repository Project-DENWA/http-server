import {
  Controller,
  Body,
  Get,
  UseGuards,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  HttpStatus,
  Delete,
  HttpException,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserModel } from 'src/models/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { NotificationSettingsDto } from './dto/update-notification.dto';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerAvatarConfig } from 'src/config/multer-avatar.config';
import { multerCoverConfig } from 'src/config/multer-cover.config';
import { UpdateUsernameDto } from './dto/update-username.dto';
import ResponseRo from 'src/common/ro/Response.ro';
import { PublicUser } from './ro/public-user.ro';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { UpdateAvatarRo } from './ro/update-avatar.ro';
import { PrivateUser, PrivateUserRo } from './ro/private-user.ro';
import { UpdateCoverRo } from './ro/update-cover.ro';
import { promisify } from 'util';
import * as fs from 'fs';
import { TfaSecretRo } from './ro/tfa-secret.ro';
import { SwitchTfaDto } from './dto/switch-tfa.dto';

const unlinkAsync = promisify(fs.unlink);

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get user profile by username.' })
  @ApiResponse({ status: 200, type: PublicUser })
  @Get('/profile/:username')
  async getProfileByUsername(
    @Param('username') username: string,
  ): Promise<PublicUser> {
    const user = await this.usersService.getUserOrThrow({ name: username });

    return new PublicUser(user);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile by JWT.' })
  @ApiResponse({ status: 200, type: PrivateUserRo })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfileById(
    @Req() req: AuthenticatedRequest,
  ): Promise<PrivateUserRo> {
    const userModel = await this.usersService.getUserOrThrow({
      id: req.user.id,
    });
    return {
      ok: true,
      result: new PrivateUser(userModel),
    };
  }

  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({ status: 200, type: [UserModel] })
  @Get('/')
  getAll() {
    return this.usersService.getAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mail update' })
  @Patch('update-email')
  @ApiOkResponse({
    description: 'Successful mail update',
    type: ResponseRo,
  })
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  async updateEmail(
    @Req() req: AuthenticatedRequest,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<ResponseRo> {
    await this.usersService.updateEmail(req.user.id, updateEmailDto);

    return {
      ok: true,
      message: 'Email have been successfully updated',
    };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Username update' })
  @Patch('update-username')
  @ApiOkResponse({
    description: 'Successful username update',
    type: ResponseRo,
  })
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  async updateUsername(
    @Req() req: AuthenticatedRequest,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ): Promise<ResponseRo> {
    await this.usersService.updateUsername(req.user.id, updateUsernameDto);

    return {
      ok: true,
      message: 'The username have been successfully updated',
    };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Description update' })
  @Patch('update-description')
  @ApiOkResponse({
    description: 'Successful description update',
    type: ResponseRo,
  })
  @UseGuards(JwtAuthGuard)
  async updateDescription(
    @Req() req: AuthenticatedRequest,
    @Body() updateDescriptionDto: UpdateDescriptionDto,
  ): Promise<ResponseRo> {
    await this.usersService.updateDescription(
      req.user.id,
      updateDescriptionDto,
    );

    return {
      ok: true,
      message: 'The description have been successfully updated',
    };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Password update' })
  @Patch('update-password')
  @ApiOkResponse({
    description: 'Successful password update',
    type: ResponseRo,
  })
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseRo> {
    await this.usersService.updatePassword(req.user.id, updatePasswordDto);

    return {
      ok: true,
      message: 'The password have been successfully updated',
    };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Notification settings update' })
  @Patch('update-notification')
  @ApiOkResponse({
    description: 'Successful notification settings update',
    type: ResponseRo,
  })
  @UseGuards(JwtAuthGuard)
  async updateNotificationSettings(
    @Req() req: AuthenticatedRequest,
    @Body() dto: NotificationSettingsDto,
  ): Promise<ResponseRo> {
    await this.usersService.updateNotificationSettings(req.user.id, dto);

    return {
      ok: true,
      message: 'Notifications have been successfully updated',
    };
  }

  @ApiOperation({ summary: 'Update account avatar.' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => UpdateAvatarRo,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('newAvatar', multerAvatarConfig))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ): Promise<UpdateAvatarRo> {
    if (!file) {
      throw new BadRequestException('The file has not been provided');
    }
    const userModel = await this.usersService.getUser({ id: req.user.id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const previousAvatarPath = `uploads/avatars/${userModel.avatar.icon}`;

    await this.usersService.setAvatar(
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
      result: { url: file.filename },
    };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Updating the user cover' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => UpdateCoverRo,
  })
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
  ): Promise<UpdateCoverRo> {
    if (!file) {
      throw new BadRequestException('The file has not been provided');
    }
    const userModel = await this.usersService.getUser({ id: req.user.id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const previousCoverPath = `uploads/covers/${userModel.avatar.cover}`;

    await this.usersService.setCover(
      userModel.id,
      file.filename,
    );

    if (userModel.avatar.cover) {
      try {
        await unlinkAsync(previousCoverPath);
      } catch (error) {
        console.error('Error deleting previous cover:', error.message);
      }
    }

    return {
      ok: true,
      result: { url: file.filename },
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

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete profile' })
  @ApiOkResponse({
    description: 'Successful user deletion message',
    type: ResponseRo,
  })
  @Delete('/delete')
  async deleteProfile(@Req() req: AuthenticatedRequest): Promise<ResponseRo> {
    await this.usersService.deleteUser(req.user.id);
    return {
      ok: true,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create 2FA' })
  @ApiOkResponse({
    description: 'Successful 2FA created',
    type: TfaSecretRo,
  })
  @Get('/create-tfa')
  async createTfa(@Req() req: AuthenticatedRequest): Promise<TfaSecretRo> {
    const userModel = await this.usersService.getUserOrThrow({
      id: req.user.id,
    });
    const tfaSecret = await this.usersService.generate2FASecret(userModel);

    return {
      ok: true,
      result: tfaSecret,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Switch 2FA' })
  @ApiOkResponse({
    description: 'Successful 2FA send',
    type: ResponseRo,
  })
  @Patch('/switch-tfa')
  async switchTfa(
    @Req() req: AuthenticatedRequest,
    @Body() dto?: SwitchTfaDto,
  ): Promise<ResponseRo> {
    await this.usersService.switchTfa(req.user.id, dto);

    return {
      ok: true,
      message: 'Tfa successfully switched',
    };
  }
}
