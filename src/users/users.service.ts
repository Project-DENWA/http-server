import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AvatarModel } from "src/models/avatar.model";
import { EmailModel } from "src/models/email.model";
import { MetaModel } from "src/models/meta.model";
import { NotificationModel } from "src/models/notification.model";
import { TfaModel } from "src/models/tfa.model";
import { UserModel } from "src/models/user.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { ReturnObj } from "src/interfaces/return-object.interface";
import { MailerService } from '@nestjs-modules/mailer';

Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserModel>,
    @InjectRepository(MetaModel)
    private metaRepository: Repository<MetaModel>,
    @InjectRepository(TfaModel)
    private tfaRepository: Repository<TfaModel>,
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
    userModel.tfa = new TfaModel();
    userModel.meta = metaModel;
    userModel.avatar = new AvatarModel();
    userModel.notification = new NotificationModel();

    await this.emailRepository.save(userModel.email);
    await this.metaRepository.save(userModel.meta);
    await this.tfaRepository.save(userModel.tfa);
    await this.avatarRepository.save(userModel.avatar);
    await this.notificationRepository.save(userModel.notification);
    await this.usersRepository.save(userModel);

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
    const userModel = await this.usersRepository.findOne({
      relations: {
        meta: true,
        tfa: true,
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
        { tfa: { token: tfaToken } },
      ],
      select: {
        meta: { id: true, name: true, description: true },
        tfa: { id: true, secret: true, token: true },
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

  private async sendEmail(
    userModel: UserModel,
    subject: string,
    template: string,
    context: object,
  ): Promise<ReturnObj> {
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
  ): Promise<ReturnObj> {
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
}