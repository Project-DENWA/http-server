import {
  Body,
  Controller,
  Post,
  Req,
  Ip,
  Delete,
  Param,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Res,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionGuard } from 'src/sessions/guards/session.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { UsersService } from 'src/users/users.service';
import ResponseRo from 'src/common/ro/Response.ro';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { LoginRo } from './ro/login.ro';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { RefreshRo } from './ro/refresh.ro';
import { RestorePasswordDto } from './dto/restore-password.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private sessionService: SessionsService,
    private tokensService: TokensService,
  ) {}

  @ApiOperation({ summary: 'Registration of a new user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: () => LoginRo,
  })
  @Post('/registration')
  async registration(
    @Body() dto: CreateUserDto,
    @Req() req: Request,
    @Ip() ip: string,
  ): Promise<LoginRo> {
    return this.authService.registration(dto, req, ip);
  }

  @ApiOperation({ summary: 'Log in to the account.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => LoginRo,
  })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginUserDto,
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, req, ip, res);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete single session',
  })
  @ApiResponse({
    description: 'Successful session deletion message.',
    type: ResponseRo,
    status: HttpStatus.OK,
  })
  @Delete('/logout')
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseRo> {
    await this.sessionService.deleteSession(req.user.sessionId, req.user.id);

    res.cookie('x-refresh-token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
    });

    return {
      ok: true,
      message: 'The logout was successful.',
    };
  }

  @UseGuards(SessionGuard)
  @ApiOperation({
    summary: 'Updating the access token.',
  })
  @ApiResponse({
    type: () => RefreshRo,
    status: HttpStatus.CREATED,
  })
  @Get('refresh')
  async refresh(@Req() req: Request): Promise<RefreshRo> {
    const refreshToken: string | undefined = req.cookies['x-refresh-token'];
    if (!refreshToken) throw new BadRequestException('No refresh token.');

    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return {
      ok: true,
      result: { accessToken },
    };
  }

  @ApiOperation({
    summary: 'Activating a user account using an activation token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => ResponseRo,
  })
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string): Promise<ResponseRo> {
    await this.userService.activateAccount(token);

    return {
      ok: true,
      message: 'The user have been successfully activated',
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Resending the confirmation link by email.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => ResponseRo,
  })
  @Get('activate-resend')
  async activateRepeat(@Req() req: AuthenticatedRequest): Promise<ResponseRo> {
    const userModel = await this.userService.getUserOrThrow({
      id: req.user.id,
    });
    if (!userModel.email.token)
      throw new HttpException('Token not found.', HttpStatus.NOT_FOUND);

    await this.userService.sendConfirmationEmail(
      userModel,
      userModel.email.token,
    );

    return {
      ok: true,
      message: 'The letter have been successfully sended',
    };
  }

  @ApiOperation({
    summary: 'Sending an email to recover password',
  })
  @ApiOkResponse({
    description: 'Successful mail sended',
    type: () => ResponseRo,
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ResponseRo> {
    await this.authService.forgotPassword(dto);

    return {
      ok: true,
      message: 'The email was successfully sent.',
    }
  }

  @ApiOperation({ summary: 'Restore password using token' })
  @ApiOkResponse({
    description: 'Successful mail sended',
    type: ResponseRo,
  })
  @Post('restore')
  async restorePassword(@Body() dto: RestorePasswordDto): Promise<ResponseRo> {
    const tokenModel = await this.tokensService.getToken({ token: dto.token });
    if (!tokenModel)
      throw new HttpException('Token not found.', HttpStatus.NOT_FOUND);

    const userModel = await this.userService.getUserOrThrow({
      id: tokenModel.userId,
    });

    userModel.password = await this.authService.handleForgotPassword(userModel);
    await this.userService.sendRestorePasswordEmail(userModel);
    await this.tokensService.removeToken(userModel.id);

    return {
      ok: true,
    };
  }
}
