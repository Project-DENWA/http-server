import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCommentDto } from './dto/add-comment.dto';
import { WorksService } from 'src/works/works.service';
import { WorkStatus } from 'src/works/enums/work-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentModel } from 'src/models/comments.model';
import { DataSource, Repository } from 'typeorm';
import { WorkModel } from 'src/models/works.model';
import { ResumeModel } from 'src/models/resumes.model';

@Injectable()
export class CommentsService {
    constructor(
        private worksService: WorksService,
        @InjectRepository(CommentModel)
        private commentsRepository: Repository<CommentModel>,
        @InjectRepository(WorkModel)
        private worksRepository: Repository<WorkModel>,
        private readonly dataSource: DataSource,
    ) {}

    public async create(dto: AddCommentDto, userId: string): Promise<CommentModel> {
        return await this.dataSource.transaction(async (manager) => {
            const workModel = await this.worksService.getWorkOrThrow({ id: dto.workId })
            if (workModel.user.id != userId)
                throw new HttpException('You are not the owner of this work', HttpStatus.FORBIDDEN);
            if (workModel.status != WorkStatus.CLOSED)
                throw new HttpException('You cannot comment on an unfulfilled work', HttpStatus.FORBIDDEN);
            if (workModel.comment)
                throw new HttpException('A comment on this work has already been left', HttpStatus.CONFLICT);
    
            const commentModel = new CommentModel();
            commentModel.rating = dto.rating;
            commentModel.text = dto.text
            commentModel.work = workModel;
            commentModel.resume = workModel.resume;
    
            await manager.save(commentModel);
            await manager.update(WorkModel, { id: workModel.id }, {
                comment: commentModel,
            });

            const commentModels = await this.getAll({ resumeId: workModel.resume.id });

            let averageRating = 0;
            if (commentModels.length > 0) {
                averageRating = commentModels.reduce((acc, curr) => acc + curr.rating, 0) / commentModels.length;
            } else {
                averageRating = dto.rating;
            }

            await manager.update(ResumeModel, { id: workModel.resume.id }, { rating: averageRating });
    
            return commentModel;
        });
    }

    public async getComment({
        id,
        workId,
    }:{
        id?: string,
        workId?: string,
    }): Promise<CommentModel | null> {
        const commentModel = await this.commentsRepository.findOne({
            relations: {
                work: true,
                resume: true,
            },
            where: [
                { id },
                { work: { id: workId } },
            ],
        });

        return commentModel;
    }

    public async getCommentOrThrow({
        id,
        workId,
    }:{
        id?: string,
        workId?: string,
    }): Promise<CommentModel> {
        const commentModel = await this.getComment({ id, workId });
        if (!commentModel)
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

        return commentModel;
    }

    public async getAll({
        resumeId,
    }:{
        resumeId?: string,
    }): Promise<CommentModel[]> {
        const commentModels = await this.commentsRepository.find({
            relations: {
                work: true,
                resume: true,
            },
            where: [
                { resume: { id: resumeId } },
            ],
        });

        return commentModels;
    }
}
