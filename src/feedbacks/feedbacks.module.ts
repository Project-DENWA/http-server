import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackModel } from 'src/models/feedbacks.model';
import { ResumesModule } from 'src/resumes/resumes.module';
import { WorksModule } from 'src/works/works.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [FeedbacksService],
  controllers: [FeedbacksController],
  imports: [
    TypeOrmModule.forFeature([
      FeedbackModel,
    ]),
    UsersModule,
    ResumesModule,
    WorksModule,
    AuthModule,
  ],
})
export class FeedbacksModule {}
