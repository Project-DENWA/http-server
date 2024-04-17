import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModel } from 'src/models/categories.model';
import { AdminsModule } from 'src/governance/admins/admins.module';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [
    TypeOrmModule.forFeature([
      CategoryModel,
    ]),
    AdminsModule,
  ],
  exports: [
    CategoriesService,
  ],
})
export class CategoriesModule {}
