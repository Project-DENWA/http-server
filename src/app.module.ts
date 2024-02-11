import { MiddlewareConsumer, Module } from "@nestjs/common";
import { EnvFilePathModule } from "./providers/envfilepath.module";
import { PostgresModule } from "./providers/postgres.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  controllers: [],
  providers: [/*TaskService*/],
  imports: [
    EnvFilePathModule,
    PostgresModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    // ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
