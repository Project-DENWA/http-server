import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UsersService } from 'src/users/users.service';
import { WorkModel } from 'src/models/works.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PublicWork } from './ro/public-work.ro';
import { CategoriesService } from 'src/categories/categories.service';
import { WorkCategoryModel } from 'src/models/work-categories.model';
import { GetWorkDto } from './dto/get-work.dto';
import { ViewsService } from 'src/views/views.service';
import { WorkStatus } from './enums/work-status.enum';
import { ImageModel } from 'src/models/images.model';
import { ResumesService } from 'src/resumes/resumes.service';
import { WorkInProcessDto } from './dto/work-in-process.dto';
import { FeedbackStatus } from 'src/feedbacks/enums/feedback-status.enum';
import { FeedbackModel } from 'src/models/feedbacks.model';

@Injectable()
export class WorksService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(WorkModel)
        private workRepository: Repository<WorkModel>,
        private readonly categoriesService: CategoriesService,
        private viewsService: ViewsService,
        private readonly dataSource: DataSource,
        private resumesService: ResumesService,
        @InjectRepository(FeedbackModel)
        private feedbackRepository: Repository<FeedbackModel>,
    ) {}

    public async create(dto: CreateWorkDto, userId: string, images: Array<Express.Multer.File>): Promise<WorkModel> {
        return await this.dataSource.transaction(async (manager) => {
            const userModel = await this.usersService.getUserOrThrow({ id: userId })
            const existingWorkModel = await this.getWork({ name: dto.title })
            if (existingWorkModel)
                throw new HttpException('Such a work already exists', HttpStatus.CONFLICT)
        
            const workModel = new WorkModel();
            workModel.cost = dto.cost;
            workModel.deadline = dto.deadline;
            workModel.user = userModel;
            workModel.name = dto.title;
            workModel.description = dto.description;
    
            await manager.save(workModel);
            
            for (const categoryName of dto.categoryNames) {
                const categoryModel = await this.categoriesService.getCategory({ name: categoryName });
                if (!categoryModel)
                    throw new HttpException(`Category '${categoryName}' not found`, HttpStatus.NOT_FOUND);
                const workCategoryModel = new WorkCategoryModel();
                workCategoryModel.work = workModel;
                workCategoryModel.category = categoryModel;
                await manager.save(workCategoryModel);
            }

            if (images && images.length > 0) {
                await Promise.all(images.map(async (image) => {
                    const newImage = new ImageModel();
                    newImage.icon = image.filename;
                    newImage.work = workModel;
                    await manager.save(newImage);
                }));
            }
    
            return workModel;
        })
      }

    public async getAll(): Promise<PublicWork[]> {
        const works = await this.workRepository.find({
            relations: {
                user: true,
                workCategories: true,
                images: true,
            },
            select: {
                images: { id: true, icon: true, },
            },
        });


        return works.map((work) => new PublicWork(work));
    }

    public async getWork({
        id,
        name,
    }: {
        id?: string;
        name?: string;
    }): Promise<WorkModel | null> {
        const workModel = await this.workRepository.findOne({
            relations: {
                user: true,
                workCategories: true,
                images: true,
                feedbacks: true,
                comment: true,
                resume: true,
            },
            where: [
                { id },
                { name },
            ],
            select: {
                images: { id: true, icon: true, },
            },
        });

        return workModel;
    }

    public async getWorkOrThrow({
        id,
        name,
    }: {
        id?: string;
        name?: string;
    }): Promise<WorkModel> {
        const workModel = await this.getWork({ id, name })
        if (!workModel)
            throw new HttpException('Work not found', HttpStatus.NOT_FOUND);
        return workModel;
    }

    async addLike(
        { workId }: GetWorkDto,
        userId: string,
      ): Promise<void> {
        const workModel = await this.getWorkOrThrow({ id: workId });
    
        await this.viewsService.addView(userId, 'work', workModel.id);
        await this.workRepository.increment({ id: workModel.id }, 'views', 1);
      }

    public async workInProcess(dto: WorkInProcessDto, userId: string): Promise<WorkModel> {
        return await this.dataSource.transaction(async (manager) => {
            const workModel = await this.getWorkOrThrow({ id: dto.workId });
            if(workModel.user.id != userId)
                throw new HttpException('You are not the owner of this work', HttpStatus.FORBIDDEN);
            if(workModel.status != WorkStatus.OPEN)
                throw new HttpException('You have already found a contractor', HttpStatus.CONFLICT);

            const feedbackModel = workModel.feedbacks.find(feedback => feedback.resume.id === dto.resumeId);
            if (!feedbackModel)
                throw new HttpException('No feedback with such resume ID', HttpStatus.NOT_FOUND);

            const resumeModel = await this.resumesService.getResumeOrThrow({ id: dto.resumeId });

            workModel.status = WorkStatus.IN_PROCESS;
            workModel.resume = resumeModel;

            await this.changeStatus(WorkStatus.IN_PROCESS, workModel, manager);
            await this.changeStatusFeedback(FeedbackStatus.CONFIRMED, feedbackModel, manager);
            await manager.update(WorkModel, { id: workModel.id }, { resume: resumeModel });

            return workModel;
        });
    }

    public async workClosed({ workId }: GetWorkDto, userId: string): Promise<WorkModel> {
        return await this.dataSource.transaction(async (manager) => {
            const workModel = await this.getWorkOrThrow({ id: workId });
            if(workModel.user.id != userId)
                throw new HttpException('You are not the owner of this work', HttpStatus.FORBIDDEN);
            if (workModel.status != WorkStatus.IN_PROCESS)
                throw new HttpException('You can no longer change the status of a work', HttpStatus.CONFLICT);

            await this.changeStatus(WorkStatus.CLOSED, workModel, manager)
            return workModel;
        });
    }

    private async changeStatus(status: WorkStatus, workModel: WorkModel, manager: EntityManager,): Promise<void> {

        if (workModel.status == WorkStatus.CANCELED || workModel.status == WorkStatus.CLOSED)
            throw new HttpException('The status of this work can no longer be changed', HttpStatus.FORBIDDEN);
        
        await manager.update(WorkModel, { id: workModel.id }, { status })
    }

    public async changeStatusFeedback(status: FeedbackStatus, feedbackModel: FeedbackModel, manager: EntityManager): Promise<void> {
        if (feedbackModel.status == FeedbackStatus.CANSELED)
            throw new HttpException('The status of this feedback can no longer be changed', HttpStatus.FORBIDDEN);
        
        await manager.update(FeedbackModel, { id: feedbackModel.id }, { status })
    }
}
