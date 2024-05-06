import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from '../models/user.model';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { NotificationSettingsDto } from './dto/update-notification.dto';
import { EmailModel } from 'src/models/email.model';
import { AvatarModel } from 'src/models/avatar.model';
import { NotificationModel } from 'src/models/notification.model';
import { MetaModel } from 'src/models/meta.model';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { ConfigService } from '@nestjs/config';
import ResponseRo from 'src/common/ro/Response.ro';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { PublicUser } from './ro/public-user.ro';
import { TfaSecret } from './ro/tfa-secret.ro';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { SwitchTfaDto } from './dto/switch-tfa.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserModel>,
    @InjectRepository(MetaModel)
    private metaRepository: Repository<MetaModel>,
    @InjectRepository(EmailModel)
    private emailRepository: Repository<EmailModel>,
    @InjectRepository(AvatarModel)
    private avatarRepository: Repository<AvatarModel>,
    @InjectRepository(NotificationModel)
    private notificationRepository: Repository<NotificationModel>,
    private readonly configService: ConfigService,
  ) {}

  public async create(dto: CreateUserDto, activationToken: string) {
    const emailModel = new EmailModel();
    emailModel.email = dto.email;
    emailModel.token = activationToken;

    const metaModel = new MetaModel();
    metaModel.name = dto.username;

    const userModel = new UserModel();
    userModel.fullname = dto.fullname;
    userModel.password = dto.password;
    userModel.email = emailModel;
    userModel.meta = metaModel;
    userModel.avatar = new AvatarModel();
    userModel.notification = new NotificationModel();

    await this.emailRepository.save(userModel.email);
    await this.metaRepository.save(userModel.meta);
    await this.avatarRepository.save(userModel.avatar);
    await this.notificationRepository.save(userModel.notification);
    await this.usersRepository.save(userModel);

    return userModel;
  }

  public async getUser({
    id,
    name,
    email,
    emailToken,
    refCode,
  }: {
    id?: string;
    name?: string;
    email?: string;
    emailToken?: string;
    refCode?: string;
  }): Promise<UserModel | null> {
    const userModel = await this.usersRepository.findOne({
      relations: {
        meta: true,
        email: true,
        avatar: true,
        notification: true,
        sessions: true,
        resume: true,
      },
      where: [
        { id },
        { meta: { name } },
        { email: { email } },
        { email: { token: emailToken } },
      ],
      select: {
        meta: { id: true, name: true, description: true },
        email: { id: true, email: true, verified: true, token: true },
        avatar: { id: true, icon: true, cover: true },
        notification: {
          id: true,
          news: true,
        },
      },
    });

    return userModel;
  }

  public async getUserOrThrow(args: {
    id?: string;
    name?: string;
    email?: string;
    emailToken?: string;
    refCode?: string;
  }): Promise<UserModel> {
    const userModel = await this.getUser(args);
    if (!userModel) throw new NotFoundException('User not found.');
    return userModel;
  }

  public async updateEmail(
    id: string,
    { newEmail }: UpdateEmailDto,
  ): Promise<void> {
    const existingUserModel = await this.getUser({ email: newEmail });
    if (existingUserModel)
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );

    const userModel = await this.getUserOrThrow({ id });

    userModel.email.email = newEmail;
    userModel.email.verified = false;
    userModel.email.token = v4();

    await this.emailRepository.update(
      { id: userModel.email.id },
      userModel.email,
    );

    await this.sendConfirmationEmail(userModel, userModel.email.token);
  }

  private async sendEmail(
    userModel: UserModel,
    subject: string,
    template: string,
    context: object,
  ): Promise<ResponseRo> {
    try {
      await this.mailerService.sendMail({
        to: userModel.email.email,
        subject: subject,
        template,
        context,
      });
      return {
        ok: true,
        message: 'The letter have been successfully sended',
        result: null,
      };
    } catch (error) {
      if (error.message.includes('550')) {
        throw new HttpException(
          'The email address provided cannot receive messages.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        console.log(error);
        throw new HttpException(
          'There was an error sending the email.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async sendConfirmationEmail(
    userModel: UserModel,
    activationToken: string,
  ): Promise<ResponseRo> {
    const baseUrl = process.env.BASE_URL as string;
    const activationUrl = `${baseUrl}/auth/activate/${activationToken}`;
    const context = {
      name: userModel.meta.name,
      activationUrl,
    };
    return this.sendEmail(
      userModel,
      'Account Activation',
      'confirmation-email.ejs',
      context,
    );
  }

  async sendForgotPasswordEmail(
    userModel: UserModel,
    activationToken: string,
  ): Promise<ResponseRo> {
    const baseUrl = process.env.BASE_URL as string;
    const activationUrl = `${baseUrl}/auth/restore/${activationToken}`;
    const context = {
      name: userModel.meta.name,
      activationUrl,
    };
    return this.sendEmail(
      userModel,
      'Account restore',
      'forgot-password-email.ejs',
      context,
    );
  }

  async sendRestorePasswordEmail(userModel: UserModel): Promise<ResponseRo> {
    const context = {
      name: userModel.meta.name,
      newPassword: userModel.password,
    };
    return this.sendEmail(
      userModel,
      'New password',
      'new-password-email.ejs',
      context,
    );
  }

  private async sendPasswordEmail(userModel: UserModel): Promise<ResponseRo> {
    const context = {
      name: userModel.meta.name,
    };
    return this.sendEmail(
      userModel,
      'The password has been changed',
      'password-changed-email.ejs',
      context,
    );
  }

  private async sendUsernameEmail(
    userModel: UserModel,
    oldName: string,
  ): Promise<ResponseRo> {
    const context = {
      name: userModel.meta.name,
      oldName,
    };
    return this.sendEmail(
      userModel,
      'The username has been changed',
      'new-login-email.ejs',
      context,
    );
  }

  private async sendTfaEmail(userModel: UserModel): Promise<ResponseRo> {
    const context = {
      name: userModel.meta.name,
    };

    return this.sendEmail(
      userModel,
      'TFA has been switched',
      'tfa-switched.ejs',
      context,
    );
  }

  public async activateAccount(emailToken: string): Promise<void> {
    const userModel = await this.getUserOrThrow({ emailToken });

    await this.emailRepository.update(
      { id: userModel.email.id },
      { verified: true, token: null },
    );
  }

  public async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    if (
      !(await bcrypt.compare(
        updatePasswordDto.currentPassword,
        userModel.password,
      ))
    )
      throw new UnauthorizedException({
        message: 'Passwords do not match',
      });

    userModel.password = await bcrypt.hash(updatePasswordDto.newPassword, 5);
    await this.usersRepository.save(userModel);
    await this.sendPasswordEmail(userModel);
  }

  public async getAll(): Promise<PublicUser[]> {
    const users = await this.usersRepository.find({
      relations: {
        meta: true,
        email: true,
        avatar: true,
        notification: true,
        sessions: true,
      },
      select: {
        meta: { id: true, name: true, description: true },
        email: { id: true, email: true, verified: true, token: true },
        avatar: { id: true, icon: true, cover: true },
        notification: {
          id: true,
          news: true,
        },
      },
    });

    return users.map((user) => new PublicUser(user));
  }

  public async updateNotificationSettings(
    id: string,
    dto: NotificationSettingsDto,
  ): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    if (typeof dto.news !== 'undefined') {
      userModel.notification.news = dto.news;
    }
    await this.notificationRepository.update(
      { id: userModel.notification.id },
      userModel.notification,
    );
  }

  public async updateUsername(
    id: string,
    { newUsername }: UpdateUsernameDto,
  ): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    const oldName = userModel.meta.name;
    userModel.meta.name = newUsername;
    await this.sendUsernameEmail(userModel, oldName);

    await this.metaRepository.update({ id: userModel.meta.id }, userModel.meta);
  }

  public async updateDescription(
    id: string,
    { newDescription }: UpdateDescriptionDto,
  ): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    userModel.meta.description = newDescription;

    await this.metaRepository.update({ id: userModel.meta.id }, userModel.meta);
  }

  public async setAvatar(id: string, url: string): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    userModel.avatar.icon = url;
    await this.avatarRepository.update(
      { id: userModel.avatar.id },
      userModel.avatar,
    );
  }

  public async setCover(id: string, url: string): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    userModel.avatar.cover = url;
    await this.avatarRepository.update(
      { id: userModel.avatar.id },
      userModel.avatar,
    );
  }

  async deleteUser(id: string): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    await this.usersRepository.delete({ id: userModel.id });
    await this.emailRepository.delete({ id: userModel.email.id });
    await this.metaRepository.delete({ id: userModel.meta.id });
    await this.avatarRepository.delete({ id: userModel.avatar.id });
    await this.notificationRepository.delete({ id: userModel.notification.id });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.usersRepository.increment({ id }, 'views', 1);
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.usersRepository.increment({ id }, 'likes', 1);
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.usersRepository.decrement({ id }, 'likes', 1);
  }

  public async generate2FASecret(userModel: UserModel): Promise<TfaSecret> {
    const secret = speakeasy.generateSecret({
      name: `Denwa:${userModel.meta.name}`,
    });
    if (!secret.otpauth_url)
      throw new HttpException(
        'otpauth_url is undefined',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCodeUrl };
  }

  async switchTfa(id: string, dto?: SwitchTfaDto): Promise<void> {
    const userModel = await this.getUserOrThrow({ id });

    if (userModel.tfaSecret) {
      await this.usersRepository.update(
        { id: userModel.id },
        { tfaSecret: null },
      );
      return undefined;
    } else {
      if (!dto?.secret) {
        throw new HttpException('Secret not found', HttpStatus.BAD_REQUEST);
      }
      const isTfaCodeValid = speakeasy.totp.verify({
        secret: dto.secret,
        encoding: 'base32',
        token: dto.tfaCode,
      });
      if (!isTfaCodeValid)
        throw new HttpException('Invalid 2FA code', HttpStatus.FORBIDDEN);

      await this.usersRepository.update(
        { id: userModel.id },
        { tfaSecret: dto.secret },
      );
      await this.sendTfaEmail(userModel);
    }
  }
}
