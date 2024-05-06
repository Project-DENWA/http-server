import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ResumesService } from 'src/resumes/resumes.service';
import { WorksService } from 'src/works/works.service';
import { FeedbackModel } from 'src/models/feedbacks.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicFeedbackRo } from './ro/public-feedback.ro';
import { FeedbackStatus } from './enums/feedback-status.enum';

@Injectable()
export class FeedbacksService {
    constructor(
        private resumesService: ResumesService,
        @InjectRepository(FeedbackModel)
        private feedbackRepository: Repository<FeedbackModel>,
        private worksService: WorksService,
    ) {}

    public async create(dto: CreateFeedbackDto, userId: string): Promise<void> {
        const resumeModel = await this.resumesService.getResumeOrThrow({ userId });
        const workModel = await this.worksService.getWorkOrThrow({ id: dto.workId });
        const existingFeedbackModel = await this.getFeedback({ workId: dto.workId, resumeId: resumeModel.id });
        if (existingFeedbackModel) 
            throw new HttpException('You have already created a feedback on this work', HttpStatus.CONFLICT);
        if (workModel.user.id == resumeModel.user.id)
            throw new HttpException('You can not leave feedback on your work', HttpStatus.FORBIDDEN);

        const feedbackModel = new FeedbackModel();
        feedbackModel.resume = resumeModel;
        feedbackModel.work = workModel;
        if(dto.description) feedbackModel.description = dto.description;
        await this.feedbackRepository.save(feedbackModel);
    }

    public async getFeedback({
        id,
        workId,
        resumeId,
    }:{
        id?: string;
        workId?: string;
        resumeId?: string;
    }): Promise<FeedbackModel | null> {
        const searchOptions: any = {};
        if (id) searchOptions.id = id;
        if (workId) searchOptions.workId = workId;
        if (resumeId) searchOptions.resumeId = resumeId;

        const feedbackModel = await this.feedbackRepository.findOne({
            where: {
                work: { id: workId },
                resume: { id: resumeId },
                id,
            },
        })
        return feedbackModel;
    }

    public async getFeedbackOrThrow({
        id,
        workId,
        resumeId,
    }:{
        id?: string;
        workId?: string;
        resumeId?: string;
    }): Promise<FeedbackModel> {
        const feedbackModel = await this.getFeedback({ id, workId, resumeId });
        if (!feedbackModel)
            throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
        return feedbackModel;
    }

    public async getAll({
        workId,
        resumeId,
    }:{
        workId?: string,
        resumeId?: string,
    }): Promise<PublicFeedbackRo[]> {
        const feedbacks = await this.feedbackRepository.find({
            where: [
                { work: { id: workId } },
                { resume: { id: resumeId } },
            ]
        });

        return feedbacks.map((feedback) => new PublicFeedbackRo(feedback));
    }
}
