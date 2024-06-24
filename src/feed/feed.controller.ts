import { Controller, Get, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { DataSource } from 'typeorm';
import { OptionalAuthenticatedRequest } from 'src/common/interfaces/optional-authenticated-request.interface';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt.auth.guard';
import { PublicWork } from 'src/works/ro/public-work.ro';
import { FeedDto } from 'src/common/dto/feed.dto';
import { WorksFeedRo } from './ro/works-feed.ro';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
    constructor(
        private readonly feedService: FeedService,
        private readonly dataSource: DataSource,
    ) {}

    @ApiOperation({
        summary: 'Get works feed.',
      })
    @ApiResponse({
      status: HttpStatus.OK,
      //type: () => WorksFeedRo,
    })
      @UseGuards(OptionalJwtAuthGuard)
      @ApiBearerAuth('access-token')
    //   @UseInterceptors(CacheInterceptor)
      @Get('/works')
      async works(
        @Query() dto: FeedDto,
        @Req() req: OptionalAuthenticatedRequest,
      ): Promise<WorksFeedRo> {
        return this.dataSource.transaction(async (manager) => {
          const result = await this.feedService.works(
            manager,
            dto,
            req.user?.id,
          );
          const publicWorks: PublicWork[] = result.map(work => new PublicWork(work));
          return { ok: true,  result: publicWorks };
        });
      }
    
}
