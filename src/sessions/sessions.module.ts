import { Module, forwardRef } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvFilePathModule } from 'src/providers/envfilepath.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModel } from 'src/models/sessions.model';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [
    EnvFilePathModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY as string,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([SessionModel]),
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
