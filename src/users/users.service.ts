import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
    ) {}

    async create(dto: CreateUserDto, activationToken: string) {
        const user = new User(dto);
        user.activationToken = activationToken;

        await user.save();
        return user;
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({
          where: { email },
        });
      }

    async getUserByActivationToken(activationToken: string) {
    return await this.userRepository.findOne({
        where: { activationToken },
    });
    }
}
