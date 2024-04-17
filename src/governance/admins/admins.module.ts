import { Module, forwardRef } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';
import { AdminSessionsModule } from '../admin-sessions/admin-sessions.module';
import { AdminModel } from '../models/admin.model';

@Module({
  providers: [AdminsService, JwtAdminStrategy],
  controllers: [AdminsController],
  imports: [
    forwardRef(() => AdminSessionsModule),
    TypeOrmModule.forFeature([AdminModel]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('ADMIN_PRIVATE_KEY', { infer: true }),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AdminsService, JwtModule],
})
export class AdminsModule {}
