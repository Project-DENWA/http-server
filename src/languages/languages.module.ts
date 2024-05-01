import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModel } from 'src/models/languages.model';
import { AdminsModule } from 'src/governance/admins/admins.module';

@Module({
  providers: [LanguagesService],
  controllers: [LanguagesController],
  imports: [
    TypeOrmModule.forFeature([
      LanguageModel,
    ]),
    AdminsModule,
  ],
  exports: [
    LanguagesService,
  ],
})
export class LanguagesModule {}
