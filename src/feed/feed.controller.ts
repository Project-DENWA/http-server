import { Controller, Get, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { DataSource } from 'typeorm';
import { OptionalAuthenticatedRequest } from 'src/common/interfaces/optional-authenticated-request.interface';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt.auth.guard';
import { PublicWork } from 'src/works/ro/public-work.ro';
import { WorksFeedRo } from './ro/works-feed.ro';
import { WorksFeedDto } from 'src/feed/dto/works-feed.dto';
import { UsersFeedDto } from './dto/users-feed.dto';
import { PublicUser } from 'src/users/ro/public-user.ro';
import { UsersFeedRo } from './ro/users-feed.ro';
import { ResumesFeedDto } from './dto/resumes-feed.dto';
import { ResumesFeedRo } from './ro/resumes-feed.ro';
import { PublicResume } from 'src/resumes/ro/public-resume.ro';

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
        @Query() dto: WorksFeedDto,
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

      @ApiOperation({
        summary: 'Get users feed.',
      })
      @ApiResponse({
        status: HttpStatus.OK,
        type: () => UsersFeedRo,
      })
      //   @UseInterceptors(CacheInterceptor)
      @Get('/users')
      async users(
        @Query() dto: UsersFeedDto,
      ): Promise<UsersFeedRo> {
        return this.dataSource.transaction(async (manager) => {
          const result = await this.feedService.users(
            manager,
            dto,
          );
          const publicUsers: PublicUser[] = result.map(user => new PublicUser(user));
          return { ok: true,  result: publicUsers };
        });
      }
  
      @ApiOperation({
        summary: 'Get resumes feed.',
      })
      @ApiResponse({
        status: HttpStatus.OK,
        type: () => ResumesFeedRo,
      })
      //   @UseInterceptors(CacheInterceptor)
        @Get('/resumes')
        async resumes(
          @Query() dto: ResumesFeedDto,
        ): Promise<ResumesFeedRo> {
          return this.dataSource.transaction(async (manager) => {
            const result = await this.feedService.resumes(
              manager,
              dto,
            );
            const publicResumes: PublicResume[] = result.map(resume => new PublicResume(resume));
            return { ok: true,  result: publicResumes };
          });
        }
}
