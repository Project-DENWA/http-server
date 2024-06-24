import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import ResponseRo from 'src/common/ro/Response.ro';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { PublicWork, PublicWorkRo } from './ro/public-work.ro';
import { FeedDto } from 'src/common/dto/feed.dto';
import { GetWorkDto } from './dto/get-work.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/config/multer-image.config';
import { PrivateWork, PrivateWorkRo } from './ro/private-work.ro';
import { WorkInProcessDto } from './dto/work-in-process.dto';
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
    @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
    @UseInterceptors(FilesInterceptor('images', 4, multerImageConfig))
    @Post('/create')
    async createWork(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() dto: CreateWorkDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<PublicWorkRo> {
        const workModel = new PublicWork(await this.worksService.create(dto, req.user.id, images));

        return {
            ok: true,
            message: 'Work has been created',
            result: workModel,
        }
    }

    @ApiOperation({ summary: 'Get work' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getOneWork(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest,
    ): Promise<PrivateWorkRo> {
        const workModel =  await this.worksService.getWorkOrThrow({ id })
        let result;
        if (workModel.user.id == req.user.id) {
            result = new PrivateWork(workModel);
        } else {
            result = new PublicWork(workModel);
        }

        return {
            ok: true,
            result,
        }
    }

    @ApiOperation({ summary: 'Get all works(DEV ROUTE)' })
    @Get('/')
    async getAllWorks(

    ): Promise<ResponseRo> {
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
    @Patch('/in-process')
    @ApiOperation({ summary: 'Change work status to in process' })
    async changeToInProcess(
        @Body() dto: WorkInProcessDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<PrivateWorkRo> {
        const workModel = await this.worksService.workInProcess(dto, req.user.id);

        return {
            ok: true,
            message: 'You have successfully launched the project',
            result: new PrivateWork(workModel),
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Patch('/closed')
    @ApiOperation({ summary: 'Change work status to closed' })
    async changeToClosed(
        @Body() dto: GetWorkDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<PrivateWorkRo> {
        const workModel = await this.worksService.workClosed(dto, req.user.id);

        return {
            ok: true,
            message: 'You have successfully closed the work',
            result: new PrivateWork(workModel),
        }
    }

}
