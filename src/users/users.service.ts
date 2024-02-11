import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AvatarModel } from "src/models/avatar.model";
import { EmailModel } from "src/models/email.model";
import { MetaModel } from "src/models/meta.model";
import { NotificationModel } from "src/models/notification.model";
import { TfaModel } from "src/models/tfa.model";
import { UserModel } from "src/models/user.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

Injectable()
export class UsersService {
  constructor(
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

}