import { Module } from "@nestjs/common";
import { EnvFilePathModule } from "./providers/envfilepath.module";
import { PostgresModule } from "./providers/postgres.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { SessionsModule } from "./sessions/sessions.module";
import { DIYMailerModule } from "./providers/mailer.module";
import { WorksModule } from './works/works.module';
import { TokensModule } from './tokens/tokens.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminSessionsModule } from "./governance/admin-sessions/admin-sessions.module";
import { AdministrationModule } from "./governance/administration/administration.module";
import { AdminsModule } from "./governance/admins/admins.module";
import { ModerationModule } from "./governance/moderation/moderation.module";
import { CategoriesModule } from './categories/categories.module';
import { ViewsModule } from './views/views.module';
import { ResumesModule } from './resumes/resumes.module';

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
    TokensModule,
    ScheduleModule.forRoot(),
    WorksModule,
    ScheduleModule.forRoot(),
    AdminSessionsModule,
    AdministrationModule,
    AdminsModule,
    ModerationModule,
    CategoriesModule,
    ViewsModule,
    ResumesModule,
  ],
})
export class AppModule {}
