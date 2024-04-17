import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import ResponseRo from 'src/common/ro/Response.ro';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { PublicWorkRo } from './ro/public-work.ro';

@ApiTags('Works')
@Controller('works')
export class WorksController {
    constructor(
        private readonly worksService: WorksService,
    ) {}

    @ApiOperation({ summary: 'Create a work' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createWork(
        @Body() dto: CreateWorkDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<ResponseRo> {
        const workModel = new PublicWorkRo(await this.worksService.create(dto, req.user.id));

        return {
            ok: true,
            message: 'Work has been created',
            result: workModel,
        }
    }

    @ApiOperation({ summary: 'Get work' })
    @Get('/:name')
    async getOneWork(
        @Param('name') name: string
    ): Promise<ResponseRo> {
        const workModel =  await this.worksService.getWork({ name }) 
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
}
