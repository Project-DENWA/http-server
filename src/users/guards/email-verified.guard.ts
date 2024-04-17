import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserModel } from 'src/models/user.model';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.validateRequest(user);
  }

  private async validateRequest({ id }: UserModel) {
    const userModel = await this.userService.getUserOrThrow({ id });

    if (!userModel.email.verified) {
      throw new HttpException('Email is not verified', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
