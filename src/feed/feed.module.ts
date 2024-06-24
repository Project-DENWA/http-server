import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { ViewsModule } from 'src/views/views.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [FeedService],
  controllers: [FeedController],
  imports: [
    ViewsModule,
    AuthModule,
  ],
})
export class FeedModule {}
