import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/models/user.model';
import { AdminsModule } from '../admins/admins.module';

@Module({
  providers: [ModerationService],
  controllers: [ModerationController],
  imports: [
    AdminsModule,
    TypeOrmModule.forFeature([UserModel,]),
  ],
})
export class ModerationModule {}
