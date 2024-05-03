import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import ResponseRo from 'src/common/ro/Response.ro';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { PublicWorkRo } from './ro/public-work.ro';
import { FeedDto } from 'src/common/dto/feed.dto';
import { GetWorkDto } from './dto/get-work.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/config/multer-image.config';
import { EmailVerifiedGuard } from 'src/users/guards/email-verified.guard';

@ApiTags('Works')
@Controller('works')
export class WorksController {
    constructor(
        private readonly worksService: WorksService,
    ) {}

    @ApiOperation({ summary: 'Create a work' })
    //@ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({ type: CreateWorkDto })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard/*, EmailVerifiedGuard*/)
    @UseInterceptors(FilesInterceptor('images', 4, multerImageConfig))
    @Post('/create')
    async createWork(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() dto: CreateWorkDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<ResponseRo> {
        const workModel = new PublicWorkRo(await this.worksService.create(dto, req.user.id, images));

        return {
            ok: true,
            message: 'Work has been created',
            result: workModel,
        }
    }

    @ApiOperation({ summary: 'Get work' })
    @Get('/:id')
    async getOneWork(
        @Param('id') id: string
    ): Promise<ResponseRo> {
        const workModel =  await this.worksService.getWorkOrThrow({ id }) 
        if (!workModel) {
            throw new HttpException('Work not found', HttpStatus.NOT_FOUND)
        }

        return {
            ok: true,
            result: new PublicWorkRo(workModel),
        }
    }

    @ApiOperation({ summary: 'Get all works' })
    @Get('/')
    async getAllWorks(): Promise<ResponseRo> {
        const workModels = await this.worksService.getAll()
        return {
            ok: true,
            result: workModels,
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Adds a view to the work' })
    @Post('/add-view')
    async incrementView(
      @Body() dto: GetWorkDto,
      @Req() req: AuthenticatedRequest,
    ): Promise<ResponseRo> {
      await this.worksService.addLike(dto, req.user.id);
  
      return {
        ok: true,
      };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('/create/feed')
    @ApiOperation({ summary: 'Get works feed' })
    async getWorksFeed(
        @Query() dto: FeedDto,
        @Req() req: AuthenticatedRequest,
    ) {
        const workModels = await this.worksService.getFeed(dto, req.user.id);
        return workModels.map((work) => new PublicWorkRo(work));
    }
}
