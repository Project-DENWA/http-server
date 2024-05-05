import { Module, forwardRef } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackModel } from 'src/models/feedbacks.model';
import { ResumesModule } from 'src/resumes/resumes.module';
import { AuthModule } from 'src/auth/auth.module';
import { WorksModule } from 'src/works/works.module';

@Module({
  providers: [FeedbacksService],
  controllers: [FeedbacksController],
  imports: [
    AuthModule,
    ResumesModule,
    TypeOrmModule.forFeature([
      FeedbackModel,
    ]),
    forwardRef(() => WorksModule),
  ],
  exports: [
    FeedbacksService,
  ],
})
export class FeedbacksModule {}
