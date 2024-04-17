import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { v4 } from 'uuid';
import { UserModel } from 'src/models/user.model';
import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';
import { LoginRo } from './ro/login.ro';
import { TokensRo } from './ro/tokens.ro';
import { PrivateUser } from 'src/users/ro/private-user.ro';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private sessionService: SessionsService,
  ) {}

  public async login(
    dto: LoginUserDto,
    req: Request,
    ip: string,
    res: Response,
  ): Promise<LoginRo> {
    const userModel = await this.validateUser(dto);
    const tokens: TokensRo = await this.generateTokens(userModel, req, ip);

    res.cookie('x-refresh-token', tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return {
      ok: true,
      result: {
        tokens,
        user: new PrivateUser(userModel),
      },
    };
  }

  private async validateUser(dto: LoginUserDto): Promise<UserModel> {
    const userModel = await this.userService.getUserOrThrow({
      email: dto.account,
      name: dto.account,
    });

    const passwordEquals = await bcrypt.compare(
      dto.password,
      userModel.password,
    );
    if (!passwordEquals)
      throw new ForbiddenException({
        message: 'The passwords do not match.',
      });

    return userModel;
  }

  public async registration(
    dto: CreateUserDto,
    req: Request,
    ip: string,
  ): Promise<LoginRo> {
    const userModel = await this.userService.getUser({
      email: dto.email,
      name: dto.username,
    });
    if (userModel)
      throw new HttpException(
        'Such a user already exists',
        HttpStatus.CONFLICT,
      );

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const activationToken = v4();
    const user = await this.userService.create(
      {
        ...dto,
        password: hashPassword,
      },
      activationToken,
    );

    await this.userService.sendConfirmationEmail(user, activationToken);
    const tokens: TokensRo = await this.generateTokens(user, req, ip);

    return {
      ok: true,
      result: {
        tokens,
        user: new PrivateUser(user),
      },
    };
  }

  private createAccessToken(userModel: UserModel, sessionId: string): string {
    const payload = {
      email: userModel.email,
      id: userModel.id,
      username: userModel.meta.name,
      fullname: userModel.fullname,
      sessionId: sessionId,
    };

    return this.jwtService.sign(payload, { expiresIn: '30m' });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const decoded = this.jwtService.verify(refreshToken);
    const session = await this.sessionService.getSession({ refreshToken });

    if (!session || session.user.id !== decoded.userId)
      throw new UnauthorizedException('Invalid refresh token');

    const userModel = await this.userService.getUserOrThrow({
      id: session.user.id,
    });

    const accessToken = this.createAccessToken(userModel, session.id);

    return accessToken;
  }

  private async generateTokens(
    userModel: UserModel,
    req: Request,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenPayload = {
      userId: userModel.id,
    };
    let refreshToken: string;
    const userAgent =
      (req.headers as { [key: string]: any })['user-agent'] || 'unknown';
    let sessionModel = await this.sessionService.getSession({ ip, userAgent });
    if (!sessionModel) {
      refreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      });
      const createSessionDto: CreateSessionDto = {
        user: userModel,
        userAgent:
          (req.headers as { [key: string]: any })['user-agent'] || 'unknown',
        ip,
        refreshToken,
      };
      sessionModel = await this.sessionService.createSession(createSessionDto);
    }

    refreshToken = sessionModel.refreshToken;
    const accessToken = this.createAccessToken(userModel, sessionModel.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generatePassword(length: number) {
    const password: string = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
    const hashPassword: string = await bcrypt.hash(password, 5);
    return {
      password,
      hashPassword,
    };
  }

  async handleForgotPassword(userModel: UserModel): Promise<string> {
    const { password, hashPassword } = await this.generatePassword(12);
    try {
      userModel.password = hashPassword;
      await userModel.save();
    } catch (error) {
      throw new UnauthorizedException('Server error ', error);
    }
    return password;
  }

  async validateUserByToken(token: string): Promise<string | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return String(decoded.id);
    } catch (e) {
      return null;
    }
  }
}
