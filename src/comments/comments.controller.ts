import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { AddCommentDto } from './dto/add-comment.dto';
import { CommentRo, CommentRoModel, CommentsRoModel } from './ro/comment-ro';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(
        private commentsService: CommentsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Post('/add-comment')
    @ApiOperation({ summary: 'Add a comment to the completed work' })
    async addComment(
        @Req() req: AuthenticatedRequest,
        @Body() dto: AddCommentDto
    ): Promise<CommentRoModel> {
        const commentModel = await this.commentsService.create(dto, req.user.id);

        return {
            ok: true,
            result: new CommentRo(commentModel),
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('/get-comment/:workid')
    @ApiOperation({ summary: 'Get a comment by workId' })
    async getOne(
        @Param('workid') workId: string,
    ): Promise<CommentRoModel> {
        const commentModel = await this.commentsService.getCommentOrThrow({ workId });

        return {
            ok: true,
            result: new CommentRo(commentModel),
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('/get-all/:resumeid')
    @ApiOperation({ summary:'Get all comments on completed work' })
    async getAll(
        @Param('resumeid') resumeId: string,
    ): Promise<CommentsRoModel> {
        const commentModels = await this.commentsService.getAll({ resumeId });

        return {
            ok: true,
            result: commentModels.map((comment) => new CommentRo(comment)),
        }
    }
}
