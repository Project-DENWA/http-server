import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AvatarModel } from "src/models/avatar.model";
import { EmailModel } from "src/models/email.model";
import { MetaModel } from "src/models/meta.model";
import { NotificationModel } from "src/models/notification.model";
import { UserModel } from "src/models/user.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { MailerService } from '@nestjs-modules/mailer';
import ResponseRo from "src/common/ro/Response.ro";
import { UpdateUsernameDto } from "./dto/update-username.dto";
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PublicUserDto } from "./dto/public-user.dto";

Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    @InjectRepository(MetaModel)
    private metaRepository: Repository<MetaModel>,
    @InjectRepository(EmailModel)
    private emailRepository: Repository<EmailModel>,
    @InjectRepository(AvatarModel)
    private avatarRepository: Repository<AvatarModel>,
    @InjectRepository(NotificationModel)
    private notificationRepository: Repository<NotificationModel>,
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
    await this.userRepository.save(userModel);

    return userModel;
  }

  public async getUser({
    id,
    name,
    email,
    tfaToken,
    emailToken,
  }: {
    id?: string;
    name?: string;
    email?: string;
    tfaToken?: string;
    emailToken?: string;
  }): Promise<UserModel | null> {
    const userModel = await this.userRepository.findOne({
      relations: {
        meta: true,
        email: true,
        avatar: true,
        notification: true,
        sessions: true,
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
          messages: true,
        },
      },
    });

    return userModel;
  }

  public async getAll(): Promise<UserModel[]> {
    return await this.userRepository.find({
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
          news: true,
          messages: true,
        },
      },
    });
  }
  
  public async activateAccount(emailToken: string): Promise<ResponseRo> {
    const userModel = await this.getUser({ emailToken });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.emailRepository.update(
      { id: userModel.email.id },
      { verified: true, token: null },
    );
    return {
      ok: true,
      message: 'The user have been successfully activated',
      result: null,
    };
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

  public async sendTfaEmail(userModel: UserModel): Promise<ResponseRo> {
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


  public async updateUsername(
    id: string,
    { newUsername }: UpdateUsernameDto,
  ): Promise<ResponseRo> {
    const userModel = await this.getUser({ id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const oldName = userModel.meta.name;
    userModel.meta.name = newUsername;
    this.sendUsernameEmail(userModel, oldName);

    await this.metaRepository.update({ id: userModel.meta.id }, userModel.meta);

    return {
      ok: true,
      message: 'The username have been successfully updated',
      result: new PublicUserDto(userModel)
    };
  }

  async switchTfa(id: string): Promise<ResponseRo> {
    const userModel = await this.getUser({ id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (userModel.tfaSecret) {
      await this.userRepository.update(
        { id: userModel.id },
        { tfaSecret: null },
      );
      return {
        ok: true,
        message: 'Tfa was successfully switched off',
        result: null,
      };
    } else {
      const tfaSecret = await this.generate2FASecret(userModel);
      if (!tfaSecret) {
        throw new HttpException(
          '2FA secret not found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.sendTfaEmail(userModel);

      return {
        ok: true,
        message: 'Tfa was successfully switched on',
        result: tfaSecret,
      };
    }
  }

  private async generate2FASecret(
    userModel: UserModel,
  ): Promise<{ secret: string; qrCodeUrl: string } | undefined> {
    const secret = speakeasy.generateSecret({
      name: `ParaPresent:${userModel.meta.name}`,
    });
    await this.userRepository.update(
      { id: userModel.id },
      { tfaSecret: secret.base32 },
    );

    if (secret.otpauth_url) {
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
      return { secret: secret.base32, qrCodeUrl };
    } else {
      console.error('otpauth_url is undefined');
    }
  }

  public async setAvatar(id: string, avatarUrl: string): Promise<string> {
    const userModel = await this.getUser({ id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    userModel.avatar.icon = avatarUrl;
    await this.avatarRepository.update(
      { id: userModel.avatar.id },
      userModel.avatar,
    );
    return avatarUrl;
  }

  async setCover(id: string, coverUrl: string): Promise<string> {
    const userModel = await this.getUser({ id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    userModel.avatar.cover = coverUrl;
    await this.avatarRepository.update(
      { id: userModel.avatar.id },
      userModel.avatar,
    );
    return coverUrl;
  }


  public async updateProfile(
    id: string,
    dto: UpdateProfileDto,
  ): Promise<ResponseRo> {
    const userModel = await this.getUser({ id });
    if (!userModel) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (dto.newFullname) userModel.fullname = dto.newFullname;
    if (dto.newBio) userModel.bio = dto.newBio;

    await this.userRepository.update({ id: userModel.id }, { fullname: userModel.fullname, bio: userModel.bio });

    return {
      ok: true,
      message: 'The profile have been successfully updated',
      result: new PublicUserDto(userModel)
    };
  }
}