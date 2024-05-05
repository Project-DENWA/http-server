import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { WorksModule } from 'src/works/works.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModel } from 'src/models/comments.model';
import { WorkModel } from 'src/models/works.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    AuthModule,
    WorksModule,
    TypeOrmModule.forFeature([
      CommentModel,
      WorkModel,
    ]),
  ],
})
export class CommentsModule {}
