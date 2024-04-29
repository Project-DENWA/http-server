import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModel } from 'src/models/avatar.model';
import { EmailModel } from 'src/models/email.model';
import { MetaModel } from 'src/models/meta.model';
import { NotificationModel } from 'src/models/notification.model';
import { UserModel } from 'src/models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModel } from 'src/models/sessions.model';
import { TokenModel } from 'src/models/tokens.model';
import { WorkModel } from 'src/models/works.model';
import { AdminModel } from 'src/governance/models/admin.model';
import { AdminSessionModel } from 'src/governance/models/admin-sessions.model';
import { CategoryModel } from 'src/models/categories.model';
import { WorkCategoryModel } from 'src/models/work-categories.model';
import { ViewsModel } from 'src/models/views.model';
import { ImageModel } from 'src/models/images.model';
import { SocialModel } from 'src/models/social.model';
import { ResumeModel } from 'src/models/resumes.model';
import { ResumeCategoryModel } from 'src/models/resume-categories.model';
import { FeedbackModel } from 'src/models/feedbacks.model';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST') as string,
          port: Number(configService.get('POSTGRES_PORT')),
          username: configService.get('POSTGRES_USER') as string,
          password: configService.get('POSTGRES_PASSWORD') as string,
          database: configService.get('POSTGRES_DB') as string,
          entities: [
            AvatarModel,
            EmailModel,
            MetaModel,
            NotificationModel,
            UserModel,
            SessionModel,
            TokenModel,
            WorkModel,
            AdminModel,
            AdminSessionModel,
            CategoryModel,
            WorkCategoryModel,
            ViewsModel,
            ImageModel,
            SocialModel,
            ResumeModel,
            ResumeCategoryModel,
            FeedbackModel,
          ],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class PostgresModule {}
