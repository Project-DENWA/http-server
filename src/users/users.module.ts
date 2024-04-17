import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/models/user.model';
import { EmailModel } from 'src/models/email.model';
import { MetaModel } from 'src/models/meta.model';
import { AvatarModel } from 'src/models/avatar.model';
import { NotificationModel } from 'src/models/notification.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    SessionsModule,
    TypeOrmModule.forFeature([
      UserModel,
      MetaModel,
      EmailModel,
      AvatarModel,
      NotificationModel,
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
