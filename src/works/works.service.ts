import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UsersService } from 'src/users/users.service';
import { WorkModel } from 'src/models/works.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PublicWorkRo } from './ro/public-work.ro';
import { CategoriesService } from 'src/categories/categories.service';
import { WorkCategoryModel } from 'src/models/work-categories.model';
import { FeedDto } from 'src/common/dto/feed.dto';
import { GetWorkDto } from './dto/get-work.dto';
import { ViewsService } from 'src/views/views.service';
import { WorkStatus } from './enums/work-status.enum';
import { ImageModel } from 'src/models/images.model';

@Injectable()
export class WorksService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(WorkModel)
        private workRepository: Repository<WorkModel>,
        private readonly categoriesService: CategoriesService,
        private viewsService: ViewsService,
        private readonly dataSource: DataSource,
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

    public async getAll(): Promise<PublicWorkRo[]> {
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


        return works.map((work) => new PublicWorkRo(work));
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
                images: true,
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

    public async getFeed(dto: FeedDto, userId: string) {
        const viewedIds = await this.viewsService.getViewedIds(
            userId,
            'work',
        );
        const query = this.workRepository.createQueryBuilder('work')
            .leftJoinAndSelect('work.user', 'user')
            .leftJoinAndSelect('work.workCategories', 'categories')
            .leftJoinAndSelect('work.images', 'images') 
        query.where('(work.status != :status OR work.status IS NULL)', {
            status: WorkStatus.CLOSED,
        });
        if (viewedIds.length > 0) {
            query.orderBy(
              `CASE WHEN work.id IN (:...viewedIds) THEN 1 ELSE 0 END`,
              'ASC',
            );
        }

        if (dto.sort === 'relevance') {
            query.addSelect(
                'work.views',
                'relevance',
            );
            query.addOrderBy('relevance', 'DESC');
        } else {
            query.addOrderBy('work.created_at', 'DESC');
        }

        if (viewedIds.length > 0) {
            query.setParameter('viewedIds', viewedIds);
        }

        const offset = (dto.page - 1) * dto.pageSize;
        query.offset(offset);
        query.limit(dto.pageSize);

        try {
            return query.getMany();
          } catch (error) {
            throw new HttpException(
                'Error when getting a collection feed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
    }
}
