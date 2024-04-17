import { Module } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { AdministrationController } from './administration.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AdministrationService],
  controllers: [AdministrationController],
  imports: [AuthModule, UsersModule],
})
export class AdministrationModule {}
