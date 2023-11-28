import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { User } from 'src/users/users.model';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    
    constructor(
        private userService: UsersService,
        private readonly mailerSerivce: MailerService,
        private jwtService: JwtService,
    ) {}

    async registration(dto: CreateUserDto, req: Request, ip: string) {
        let candidate: User;
        if (dto.email) {
            candidate = await this.userService.getUserByEmail(dto.email);
        }
        if (candidate) {
            throw new HttpException('Пользователь с такой почтой уже существует', HttpStatus.CONFLICT);
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
        
        await this.sendConfirmationEmail(user, activationToken);

        return this.generateTokens(user, req, ip)

    }

    private async sendConfirmationEmail(user: User, activationToken: string) {
        const baseUrl = process.env.BASE_URL as string;
        const activationUrl = `${baseUrl}/auth/activate/${activationToken}`;

        await this.mailerSerivce.sendMail({
            to: user.email,
            subject: 'Confirm Email',
            html: 
            `
                <p>Здравствуйте, ${user.fio}!</p>
                <p>Чтобы активировать свой аккаунт, пожалуйста, кликните на <a href="${activationUrl}">ссылку</a>.</p>
            `,
            template: '',
            context: {
                name: user.fio,
                url: activationUrl,
            },
        });
    }

    async activateAccount(activationToken: string) {
        const user: User = await this.userService.getUserByActivationToken(activationToken);
        if (!user) {
            throw new HttpException('Токен активанции невалиден', HttpStatus.NOT_FOUND);
        }
        user.isEmailVerified = true;
        user.activationToken = null;
        
        await user.save();
    }

    private createAccessToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            fio: user.fio,
        };
        return this.jwtService.sign(payload, {expiresIn: '30m'});
    }

    async generateTokens(user: User, req: Request, ip: string) {
        const refreshTokenPayload = {
            userId: user.id,
        };

        const accessToken = this.createAccessToken(user);
        const refreshToken = this.jwtService.sign(refreshTokenPayload,{
            expiresIn: '7d',
        });

        // const createSessionDto: CreateSessionDto = {
    }
}
