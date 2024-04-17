import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UsersService } from 'src/users/users.service';
import { WorkModel } from 'src/models/works.model';
import { MetaModel } from 'src/models/meta.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicWorkRo } from './ro/public-work.ro';
import { CategoriesService } from 'src/categories/categories.service';
import { WorkCategoryModel } from 'src/models/work-categories.model';

@Injectable()
export class WorksService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(MetaModel)
        private readonly metaRepository: Repository<MetaModel>,
        @InjectRepository(WorkModel)
        private workRepository: Repository<WorkModel>,
        private readonly categoriesService: CategoriesService,
        @InjectRepository(WorkCategoryModel)
        private workCategoryRepository: Repository<WorkCategoryModel>,
    ) {}

    public async create(dto: CreateWorkDto, userId: string) {
        const userModel = await this.usersService.getUser({ id: userId })
        if (!userModel)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const existingWorkModel = await this.getWork({ name: dto.title })
        if (existingWorkModel)
            throw new HttpException('Such a work already exists', HttpStatus.CONFLICT)
    
        const workModel = new WorkModel();
        workModel.cost = dto.cost;
        workModel.deadline = dto.deadline;
        workModel.user = userModel;

        const metaModel = new MetaModel();
        metaModel.name = dto.title;
        if(dto.description) metaModel.description = dto.description;
        workModel.meta = metaModel;

        await this.metaRepository.save(metaModel);
        await this.workRepository.save(workModel);
        
        for (const categoryName of dto.categoryNames) {
            const categoryModel = await this.categoriesService.getCategory({ name: categoryName });
            if (!categoryModel)
                throw new HttpException(`Category '${categoryName}' not found`, HttpStatus.NOT_FOUND);
            const workCategoryModel = new WorkCategoryModel();
            workCategoryModel.work = workModel;
            workCategoryModel.category = categoryModel;
            await this.workCategoryRepository.save(workCategoryModel);
        }

        return workModel;
      }

    public async getAll(): Promise<PublicWorkRo[]> {
        const works = await this.workRepository.find({
            relations: {
                meta: true,
                user: true,
                workCategories: true,
            },
            select: {
                meta: { id: true, name: true, description: true, },
            }
        });


        return works.map((work) => new PublicWorkRo(work));
    }

    
    async getWork({
        id,
        name,
    }: {
        id?: string;
        name?: string;
    }): Promise<WorkModel | null> {
        const workModel = await this.workRepository.findOne({
            relations: {
                meta: true,
                user: true,
            },
            where: [
                { id },
                { meta: { name } },
            ],
            select: {
                meta: { id: true, name: true, description: true },
            },
        });

        return workModel;
    }
}
