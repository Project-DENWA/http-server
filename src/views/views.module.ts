import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewsModel } from 'src/models/views.model';

@Module({
  providers: [ViewsService],
  imports: [
    TypeOrmModule.forFeature([
      ViewsModel,
    ])
  ],
  exports: [
    ViewsService,
  ],
})
export class ViewsModule {}
