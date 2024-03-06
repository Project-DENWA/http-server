import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { UserModel } from "src/models/user.model";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { SessionsService } from "src/sessions/sessions.service";
import { CreateSessionDto } from "src/sessions/dto/create-session.dto";
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { PublicUserDto } from "src/users/dto/public-user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { v4 } from "uuid";
import ResponseRo from "src/common/ro/Response.ro";
import * as crypto from 'crypto';

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
      ): Promise<ResponseRo> {
        const userModel = await this.validateUser(dto);
        const tokens: object = await this.generateTokens(userModel, req, ip);
    
        if (userModel.tfaSecret) {
          if (!dto.tfaCode) {
            throw new HttpException('2FA code is required', HttpStatus.FORBIDDEN);
          }
          const isTfaCodeValid = speakeasy.totp.verify({
            secret: userModel.tfaSecret,
            encoding: 'base32',
            token: dto.tfaCode,
          });
    
          if (!isTfaCodeValid) {
            throw new HttpException('Invalid 2FA code', HttpStatus.FORBIDDEN);
          }
        }
    
        const publicUser = new PublicUserDto(userModel);
        return {
          ok: true,
          message: 'User successfully authorized',
          result: {
            tokens,
            userModel: publicUser,
          },
        };
      }

      private async validateUser(dto: LoginUserDto): Promise<UserModel> {
        const userModel = await this.userService.getUser({
          email: dto.email,
          name: dto.username,
        });
    
        if (!userModel) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        const passwordEquals = await bcrypt.compare(
          dto.password,
          userModel.password,
        );
        if (!passwordEquals) {
          throw new UnauthorizedException({
            message: 'The passwords do not match',
          });
        }
    
        return userModel;
      }

      private async generateTokens(
        userModel: UserModel,
        req: Request,
        ip: string,
      ): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshTokenPayload = {
          userId: userModel.id,
        };
    
        const accessToken = this.createAccessToken(userModel);
        const refreshToken = this.jwtService.sign(refreshTokenPayload, {
          expiresIn: '7d',
        });
    
        const createSessionDto: CreateSessionDto = {
          userId: userModel.id,
          userAgent:
            (req.headers as { [key: string]: any })['user-agent'] || 'unknown',
          ip,
          refreshToken,
        };
    
        await this.sessionService.createSession(createSessionDto);
    
        return {
          accessToken,
          refreshToken,
        };
      }

      private createAccessToken(userModel: UserModel): string {
        const payload = {
          email: userModel.email,
          id: userModel.id,
          username: userModel.meta.name,
          fullname: userModel.fullname,
        };
    
        return this.jwtService.sign(payload, { expiresIn: '30m' });
      }

      public async registration(
        dto: CreateUserDto,
        req: Request,
        ip: string,
      ): Promise<ResponseRo> {
        const userModel = await this.userService.getUser({
          email: dto.email,
          name: dto.username,
        });
        if (userModel) {
          throw new HttpException(
            'Such a user already exists',
            HttpStatus.CONFLICT,
          );
        }
    
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
        const tokens = await this.generateTokens(user, req, ip);
        const publicUser = new PublicUserDto(user);
    
        return {
          ok: true,
          message: 'User successfully registered',
          result: {
            tokens,
            userModel: publicUser,
          },
        };
      }

      async refreshAccessToken(refreshToken: string): Promise<ResponseRo> {
        const decoded = this.jwtService.verify(refreshToken);
        const session =
          await this.sessionService.findSessionByRefreshToken(refreshToken);
    
         if (!session || session.user.id !== decoded.userId) {
          throw new UnauthorizedException('Invalid refresh token');
        }
    
        const userModel = await this.userService.getUser({ id: session.user.id });
        const accessToken = this.createAccessToken(userModel);
    
        return {
          ok: true,
          message: 'Token successfully refreshed',
          result: accessToken
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
}
