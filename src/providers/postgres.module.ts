import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModel } from 'src/models/avatar.model';
import { EmailModel } from 'src/models/email.model';
import { MetaModel } from 'src/models/meta.model';
import { NotificationModel } from 'src/models/notification.model';
import { UserModel } from 'src/models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TfaModel } from 'src/models/tfa.model';

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
            TfaModel,
            NotificationModel,
            UserModel,
          ],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class PostgresModule {}
