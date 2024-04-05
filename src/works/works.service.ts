import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UsersService } from 'src/users/users.service';
import { WorkModel } from 'src/models/works.model';
import { MetaModel } from 'src/models/meta.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicWorkRo } from './ro/public-work.dto';

@Injectable()
export class WorksService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(MetaModel)
        private readonly metaRepository: Repository<MetaModel>,
        @InjectRepository(WorkModel)
        private workRepository: Repository<WorkModel>,
    ) {}

    public async create(dto: CreateWorkDto, userId: string) {
        const userModel = await this.usersService.getUser({ id: userId })
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const existingWorkModel = await this.getWork({ name: dto.title })
        if (existingWorkModel) {
            throw new HttpException('Such a work already exists', HttpStatus.CONFLICT)
        }
    
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
        return workModel;
      }

    public async getAll(): Promise<PublicWorkRo[]> {
        const works = await this.workRepository.find({
            relations: {
                meta: true,
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
