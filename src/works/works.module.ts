import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkModel } from 'src/models/works.model';
import { MetaModel } from 'src/models/meta.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [WorksService],
  controllers: [WorksController],
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([
      WorkModel,
      MetaModel,
    ])
  ],
})
export class WorksModule {}
