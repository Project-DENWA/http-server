import { MiddlewareConsumer, Module } from "@nestjs/common";
import { EnvFilePathModule } from "./providers/envfilepath.module";
import { PostgresModule } from "./providers/postgres.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { SessionsModule } from "./sessions/sessions.module";
import { DIYMailerModule } from "./providers/mailer.module";
import { WorksModule } from './works/works.module';

@Module({
  controllers: [],
  providers: [/*TaskService*/],
  imports: [
    EnvFilePathModule,
    PostgresModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    DIYMailerModule,
    WorksModule,
    // ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
