import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { EmailVerifiedGuard } from 'src/users/guards/email-verified.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateResumeDto } from './dto/create-resume.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { PublicResumeRo, ResumeRo } from './ro/public-resume.ro';

@ApiTags('Resumes')
@Controller('resumes')
export class ResumesController {
    constructor(
        private resumesService: ResumesService,
    ) {}
    
    @ApiOperation({ summary: 'Create a resume' })
    @ApiCreatedResponse({ description: 'Successfull create resume' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
    @Post('/create')
    async create(
        @Body() dto: CreateResumeDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<ResumeRo> {
        const resumeModel = await this.resumesService.create(dto, req.user.id);

        return {
            ok: true,
            result: new PublicResumeRo(resumeModel),
        }
    }

    @ApiOperation({ summary: 'Get resume' })
    @Get('/:userid')
    async getOneResume(
        @Param('userid') userId: string,
    ): Promise<ResumeRo> {
        const resumeModel =  await this.resumesService.getResumeOrThrow({ userId });

        return {
            ok: true,
            result: new PublicResumeRo(resumeModel),
        }
    }
}
