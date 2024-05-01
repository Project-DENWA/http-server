import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import ResponseRo from 'src/common/ro/Response.ro';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { EmailVerifiedGuard } from 'src/users/guards/email-verified.guard';

@ApiTags('Feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
    constructor(
        private feedbacksService: FeedbacksService,
    ) {}


    @ApiOperation({ summary: 'Create a feedback' })
    @ApiCreatedResponse({ description: 'Successfull create feedback' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard/*, EmailVerifiedGuard*/)
    @Post('/create')
    async create(
        @Body() dto: CreateFeedbackDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<ResponseRo> {
        await this.feedbacksService.create(dto, req.user.id);

        return {
            ok: true,
            message: 'Feedback has been successfully created',
        }
    }

    @ApiOperation({ summary: 'Get all feedbacks' })
    @Get('/')
    async getAllFeedbacks(): Promise<ResponseRo> {
        const feedbackModels = await this.feedbacksService.getAll({});
        return {
            ok: true,
            result: feedbackModels,
        }
    }
}
