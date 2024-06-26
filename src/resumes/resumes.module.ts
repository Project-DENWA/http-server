import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialModel } from 'src/models/social.model';
import { ResumeModel } from 'src/models/resumes.model';
import { ResumeCategoryModel } from 'src/models/resume-categories.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ResumeLanguageModel } from 'src/models/resume-languages.model';
import { LanguagesModule } from 'src/languages/languages.module';

@Module({
  providers: [ResumesService],
  controllers: [ResumesController],
  imports: [
      TypeOrmModule.forFeature([
        ResumeModel,
        SocialModel,
        ResumeCategoryModel,
        ResumeLanguageModel,
      ]),
      AuthModule,
      UsersModule,
      CategoriesModule,
      LanguagesModule,
  ],
  exports: [
    ResumesService,
  ],
})
export class ResumesModule {}
